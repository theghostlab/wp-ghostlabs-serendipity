<?php

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The single source of truth for which paid features are available.
 *
 * Every gated feature is checked at three layers — the editor, attribute validation and
 * render — and all three ask this class.
 *
 * It answers from one fact: whether an entitlement check has been supplied, and what it
 * says. Not from the edition, and not from any licensing type. A build that ships no
 * licensing supplies nothing and is entitled to nothing, without this class needing to
 * know what editions exist or naming a package it may not carry. That is what lets it
 * live in shared/ and be asked from shared code.
 *
 * The check arrives as a callable rather than an interface for exactly that reason: the
 * only thing ever asked of it is whether the license is good, and a closure carries no
 * type that has to resolve in a build without the license package installed.
 *
 * It fails closed throughout:
 *
 *  - an unrecognized capability is never granted, so a typo disables a feature rather
 *    than silently unlocking one;
 *  - no check supplied means no entitlement;
 *  - the check is asked, never assumed.
 *
 * There is deliberately no filter. A filter would make the gate bypassable from any
 * theme or plugin, which would defeat the point of checking three times.
 */
final class Capabilities
{
    public const BUILT_IN_LIGHTBOX     = 'built-in-lightbox';
    public const HOVER_STYLES_EXTENDED = 'hover-styles-extended';
    public const PAN_TILT              = 'pan-tilt';
    public const LAYOUT_STUDIO         = 'layout-studio';
    public const PATTERN_LIBRARY       = 'pattern-library';

    /**
     * The hover styles a license buys, and what a build without one falls back to.
     *
     * Fade-Up rather than none: a gallery that asked for a hover treatment still gets
     * one, so degrading changes which effect plays rather than taking the caption's
     * reveal away entirely.
     */
    public const LICENSED_HOVER_STYLES = [ 'style-2', 'style-3', 'style-5' ];
    public const FREE_HOVER_STYLE      = 'style-1';

    /**
     * Capabilities that require an entitlement. Anything absent from this list is either
     * unconditional — and never asks — or a mistake.
     *
     * @var list<string>
     */
    private const LICENSED = [
        self::BUILT_IN_LIGHTBOX,
        self::HOVER_STYLES_EXTENDED,
        self::PAN_TILT,
        self::LAYOUT_STUDIO,
        self::PATTERN_LIBRARY,
    ];

    /** @var (callable(): bool)|null */
    private static $check = null;

    /** @var (callable(): bool)|null What the entitlement already knows, asking no one. */
    private static $settled = null;

    /**
     * Memoized answer. The license handler behind the check caches in a transient, but a
     * single render can ask a dozen times and there is no reason to re-enter it.
     */
    private static ?bool $entitled = null;

    /**
     * Wire the gate up. A build with licensing calls this once during boot; one without
     * never calls it at all, and the defaults are already correct.
     *
     * @param (callable(): bool)|null $check   Returns whether the license is currently good.
     * @param (callable(): bool)|null $settled Returns what is already known about that without
     *                                         a remote call: a cached verdict, or the grace.
     *                                         Defaults to the check itself.
     */
    public static function boot(?callable $check = null, ?callable $settled = null): void
    {
        self::$check    = $check;
        self::$settled  = $settled;
        self::$entitled = null;
    }

    /**
     * Forget everything, including the memoized answer.
     */
    public static function reset(): void
    {
        self::$check    = null;
        self::$settled  = null;
        self::$entitled = null;
    }

    public static function has(string $capability): bool
    {
        if ( ! in_array($capability, self::LICENSED, true)) {
            return false;
        }

        return self::isEntitled();
    }

    /**
     * Whether a capability is granted, from what is already known: never a remote call.
     *
     * ⚠️ For work that runs on every request and is not the feature itself. Patterns are
     * registered on `init` for every page view, cron run and REST call, and asking `has()`
     * there meant one request per cold-cache window waited up to ten seconds on the license
     * server for a pattern list it never read (re-audit, 2026-10-17, S4). The editor asks
     * `has()` when it loads, which warms the cache before it fetches the patterns.
     *
     * Fails closed exactly as `has()` does.
     */
    public static function hasSettled(string $capability): bool
    {
        if ( ! in_array($capability, self::LICENSED, true) || self::$check === null) {
            return false;
        }

        if (self::$entitled !== null || self::$settled === null) {
            return self::isEntitled();
        }

        return (bool) (self::$settled)();
    }

    /**
     * Every gated capability and whether it is currently granted. Handy for handing the
     * editor a single payload rather than five separate answers.
     *
     * @return array<string, bool>
     */
    public static function all(): array
    {
        $granted = self::isEntitled();

        /** @var array<string, bool> $map */
        $map = [];
        foreach (self::LICENSED as $capability) {
            $map[$capability] = $granted;
        }

        return $map;
    }

    /**
     * @return list<string>
     */
    public static function gated(): array
    {
        return self::LICENSED;
    }

    private static function isEntitled(): bool
    {
        if (self::$check === null) {
            return false;
        }

        if (self::$entitled === null) {
            self::$entitled = (bool) (self::$check)();
        }

        return self::$entitled;
    }
}

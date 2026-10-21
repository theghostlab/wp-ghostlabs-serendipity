<?php

namespace GHOSTLABS\SERENDIPITY\Config;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Static identity for the plugin: the names, slugs and version every edition needs.
 *
 * Every edition ships this class, so nothing in it may name or assume a particular one.
 * The edition is read from GHOSTLABS_SERENDIPITY_EDITION at runtime; the only edition
 * this file spells out is the free one it falls back to.
 *
 * It implements no contract on purpose. The matching one ships in the licensed package,
 * and a build that does not carry that package still has to be able to load this class.
 *
 * The keys that only a licensing build derives — the REST namespace, the license
 * transient, the updater's cache key and slug — are deliberately NOT here. They had no
 * caller in a build without licensing, and this class is published with the free tier's
 * sources, so keeping them would have published a description of plumbing that build does
 * not have. They live with the edition that uses them.
 *
 * What IS here beyond identity is the one transient name the switch between editions
 * shares, so that it has a single declaration.
 */
final class PluginConfig
{
    /**
     * The edition assumed when a build never declared one.
     */
    public const TIER_FREE = 'free';

    public static string $domain = 'ghostlabs';
    public static string $slug = 'serendipity';
    public static string $version = '1.0.0';
    public static string $settingsMenuSlug = 'ghostlabs-serendipity-settings';

    private static ?string $tierOverride = null;

    /**
     * Overrides the edition. Test seam only — production reads the constant, and nothing
     * in the plugin calls this. Pass null to fall back to the constant again.
     */
    public static function overrideTier(?string $tier): void
    {
        self::$tierOverride = $tier;
    }

    /**
     * The edition this build is running as.
     *
     * Which boot class the factory resolves is derived from it, so it has to follow the
     * build rather than be fixed in source.
     *
     * A build that never declared an edition falls back to the free one: the narrower
     * identity, and the one that claims nothing it has not got.
     */
    public static function tier(): string
    {
        if (self::$tierOverride !== null) {
            return self::$tierOverride;
        }

        if ( ! defined('GHOSTLABS_SERENDIPITY_EDITION')) {
            return self::TIER_FREE;
        }

        return (string) constant('GHOSTLABS_SERENDIPITY_EDITION');
    }

    /**
     * The text domain, which every edition needs and WordPress requires to match the
     * installed directory name.
     */
    public static function domain(): string {
        return sprintf('%s-%s', self::$domain, self::$slug);
    }

    /**
     * The "you switched to the licensed edition" flag.
     *
     * The licensed edition's entry header raises it in the branch that deactivates this
     * edition, and reads-and-deletes it to show a one-shot notice. It lives in the class
     * every edition ships so that the name has one declaration.
     */
    public static function upgradePendingTransient(): string {
        return '_ghostlabs_serendipity_upgrade_pending';
    }
}

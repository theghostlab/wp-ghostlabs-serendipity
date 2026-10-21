<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Enum;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What a click on a gallery tile does.
 *
 * Four of these emit a plain anchor and let whatever lightbox the site already runs
 * pick the gallery up; the fifth opens the built-in carousel. That asymmetry is the
 * point of §6.2 — a gallery with no lightbox of its own is strictly worse than the
 * free competition, so the free tier gets a lightbox: the visitor's own.
 *
 * The default deliberately links the *full-size* file rather than the display
 * resolution. Lightbox with PhotoSwipe only recognizes links whose href is the file
 * itself, and the other three large plugins are no worse off for it.
 */
enum Lightbox: string
{
    /** Anchor to the full-size file, grouped per gallery so lightboxes can page through it. */
    case Own = 'own';

    /** Anchor to the full-size file, ungrouped. */
    case File = 'file';

    /** Anchor to the attachment page. */
    case Attachment = 'attachment';

    /** No anchor at all. */
    case None = 'none';

    /** The bundled carousel. The only value that costs a license. */
    case BuiltIn = 'builtin';

    public const DEFAULT = self::Own;

    /**
     * Parse an attribute value, falling back to the default rather than throwing.
     *
     * Attributes come from post content, which can be older than the code reading it,
     * hand-edited, or pasted from another site. An unrecognized value should degrade to
     * a plain anchor — never fatal, and never silently upgrade to the paid mode.
     */
    public static function fromAttribute(?string $value): self
    {
        if ($value === null || $value === '') {
            return self::DEFAULT;
        }

        return self::tryFrom($value) ?? self::DEFAULT;
    }

    /**
     * Blocks saved before this attribute existed carry a `carousel` boolean instead.
     *
     * Resolved here rather than by a migration so that a block saved by an older build
     * keeps rendering what its author chose, without anyone having to re-save every post.
     */
    public static function fromLegacyCarousel(?string $value, bool $carousel): self
    {
        if ($value === null || $value === '') {
            return $carousel ? self::BuiltIn : self::DEFAULT;
        }

        return self::fromAttribute($value);
    }

    /**
     * Whether this mode is gated. Only the bundled carousel is.
     */
    public function isLicensed(): bool
    {
        return $this === self::BuiltIn;
    }

    /**
     * Whether the rendered tile is wrapped in an anchor.
     */
    public function emitsAnchor(): bool
    {
        return match ($this) {
            self::Own, self::File, self::Attachment => true,
            self::None, self::BuiltIn              => false,
        };
    }
}

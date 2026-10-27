<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Enum;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What a click on a gallery tile does, in every edition.
 *
 * Three emit a plain anchor and let whatever lightbox the site already runs pick the
 * gallery up, and one emits none. That is the point of §6.2 — a gallery with no lightbox
 * of its own is strictly worse than the free competition, so every edition gets a
 * lightbox: the visitor's own. A mode an edition adds of its own is not a case here; it
 * is an extension's (`Contracts\LightboxModeInterface`).
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

    public const DEFAULT = self::Own;

    /**
     * Parse an attribute value, falling back to the default rather than throwing.
     *
     * Attributes come from post content, which can be older than the code reading it,
     * hand-edited, or pasted from another site. An unrecognized value degrades to a
     * plain anchor rather than fataling.
     */
    public static function fromAttribute(?string $value): self
    {
        if ($value === null || $value === '') {
            return self::DEFAULT;
        }

        return self::tryFrom($value) ?? self::DEFAULT;
    }

    /**
     * Whether the rendered tile is wrapped in an anchor.
     */
    public function emitsAnchor(): bool
    {
        return match ($this) {
            self::Own, self::File, self::Attachment => true,
            self::None                             => false,
        };
    }
}

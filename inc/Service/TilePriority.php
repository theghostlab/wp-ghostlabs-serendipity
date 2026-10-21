<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * A lazy tile yields the connection to the eager ones.
 *
 * Every tile a browser decides to fetch early competes with the LCP tile for bandwidth,
 * and on a phone that is most of them: Chrome's lazy-load threshold on a 4G connection is
 * several viewports, so a five-gallery page fetched 36 of its 44 tiles before any scroll.
 * `fetchpriority="low"` on the tiles core marked lazy lets the eager tiles, and the one
 * core chose to prioritize, finish first.
 *
 * Two places, because core decides `loading` in two places. Outside post content it
 * answers at render time and Serendipity::imageAttributes() applies this rule there.
 * Inside post content core deliberately ignores the render's call and decides later, in
 * one pass over the finished HTML — so this filter, on `wp_content_img_tag`, applies the
 * same rule to each tile after that pass. Only our tiles, by the marker class the render
 * puts on every one; another block's lazy image is that block's business.
 */
final class TilePriority
{
    public const MARKER = 'ghostlabs-serendipity__image';

    /**
     * @param string $tag           The <img> tag, after core's loading decisions.
     * @param string $context       The filter context; unused, kept for the signature.
     * @param int    $attachment_id The attachment; unused, kept for the signature.
     */
    public function lower(string $tag, string $context = '', int $attachment_id = 0): string
    {
        if ( ! str_contains($tag, self::MARKER)) {
            return $tag;
        }

        if ( ! str_contains($tag, 'loading="lazy"') || str_contains($tag, 'fetchpriority=')) {
            return $tag;
        }

        return preg_replace('/^<img\s/', '<img fetchpriority="low" ', $tag, 1) ?? $tag;
    }
}

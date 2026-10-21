<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * An intermediate image size for the tiles.
 *
 * Core generates 150, 300, 768 and 1024 wide, and nothing between 300 and 768. A mosaic
 * tile on a phone is half or a third of the viewport: at 412 CSS px and a device pixel
 * ratio of 1.75 to 3, that is 300 to 620 device pixels, and the 300-wide file falls one
 * pixel short of the smallest of those. So every phone fetched the 768-wide file — 107 KB
 * for a tile that needed 40 — whatever `sizes` said. This size is the candidate the
 * browser was missing; `Serendipity::sizesFor()` is what lets it choose it.
 *
 * Width-constrained, uncropped: the tile is cropped by `object-fit: cover` at paint time,
 * so the file keeps the photograph's own aspect ratio and core includes it in the srcset
 * alongside the other sizes, which share it.
 *
 * It applies to every upload on the site, not only gallery tiles — WordPress has no way
 * to generate a size for some attachments and not others — so it is filterable: return 0
 * from `ghostlabs_serendipity_tile_size` to register nothing, or another width to move it.
 * Existing uploads gain the size only when regenerated.
 */
final class TileSize
{
    public const NAME = 'ghostlabs-serendipity-tile';

    public const WIDTH = 480;

    /** Runs on `init`, after the theme has had its say. */
    public function register(): void
    {
        /**
         * Filter the width of the tile image size, in pixels. Zero registers nothing.
         *
         * @param int $width The width, 480 by default.
         */
        $width = (int) apply_filters('ghostlabs_serendipity_tile_size', self::WIDTH);

        if ($width <= 0) {
            return;
        }

        add_image_size(self::NAME, $width, 0, false);
    }
}

<?php

namespace GHOSTLABS\SERENDIPITY\DTO\Input;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * One image of a gallery, as the block saved it.
 *
 * ⚠️ Every property has a default. Nested items get no block.json defaults, so an image saved
 * without an optional field reached a typed property that was never set — an Error, and the
 * gallery was lost (plugin audit, 2026-10-16). Absent is empty.
 */
class RawImageDto
{
    public int $id = 0;
    public string $url = '';
    public ?string $alt = null;
    public ?string $caption = null;

    /**
     * Intrinsic size, for an image the media library cannot be asked about.
     *
     * An attachment's dimensions come from its metadata at render time; a pattern tile
     * or a pasted URL has no attachment, and without a size core will not decide
     * `loading` or `fetchpriority` for it. Zero means unknown, and the render then
     * emits no dimensions rather than a guess.
     */
    public int $width = 0;
    public int $height = 0;
}
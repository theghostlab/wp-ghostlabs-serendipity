<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * A hover style an edition adds: what goes inside a tile's list item.
 */
interface HoverStyleInterface
{
    /** The value the block stores, which is also the tile's class modifier. */
    public function slug(): string;

    /**
     * The tile's contents.
     *
     * @param string $trigger The image, inside whatever opens it.
     * @param string $caption The caption, escaped — or the link icon where there is none.
     * @param string $hidden  ` aria-hidden="true"` where the caption is already the alt, else ''.
     */
    public function tile(string $trigger, string $caption, string $hidden): string;
}

<?php
/**
 * Server-side rendering of the `ghostlabs/serendipity` block.
 *
 * Included inside `WP_Block::render()`, which supplies `$attributes`. The work is in
 * `BlockRender`, so this file assigns no variable of its own.
 *
 * @package ghostlabs-serendipity
 */

use GHOSTLABS\SERENDIPITY\Service\BlockRender;

if ( ! defined( 'ABSPATH' ) ) exit;

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped as it is built (Serendipity::render()). Its data and its first-paint CSS go through wp_add_inline_script() and wp_add_inline_style(), not this markup.
echo BlockRender::render( isset( $attributes ) && is_array( $attributes ) ? $attributes : [] );

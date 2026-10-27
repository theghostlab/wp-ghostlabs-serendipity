<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\DTO\Input\AttributesDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\LayoutDataDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\RawImageDto;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What the block's render template does, kept out of the template.
 *
 * `render.php` is included inside `WP_Block::render()`, so a variable it assigned would be a
 * local there. Plugin Check reads the file on its own and reports each one as an unprefixed
 * global. Here, they are a method's locals, and the template is one call.
 */
final class BlockRender
{
    /**
     * The gallery's markup for these attributes, or an HTML comment when they cannot be read.
     *
     * The markup is escaped as it is built (`Serendipity::render()`). It carries the layout's
     * `<style>` and the bundle's inline `<script>`, which `wp_kses_post()` would strip, so it is
     * not escaped again.
     *
     * @param array<string, mixed> $attributes
     */
    public static function render(array $attributes): string
    {
        try {
            /** @var AttributesDto $dto */
            $dto = DTOMapper::mapNested($attributes, AttributesDto::class, [
                'layoutData' => [ LayoutDataDto::class ],
                'rawImages'  => [ RawImageDto::class ],
            ]);

            return ( new Serendipity($dto, $attributes) )->render();
        } catch (\Throwable $e) {
            // ⚠️ Throwable, not ReflectionException. Block markup is author data, and a typed
            // property it leaves out, or an image that is not an object, throws an Error or a
            // TypeError — which fataled the whole page rather than this block (plugin audit,
            // 2026-10-16).
            //
            // The cause goes to WordPress's debug channel, never into the markup. It says
            // nothing unless WP_DEBUG is on, and then goes where the site sends PHP's own
            // errors: the log, or the page under WP_DEBUG_DISPLAY. Core runs the message
            // through kses first.
            wp_trigger_error(__METHOD__, 'render error: ' . $e->getMessage(), E_USER_WARNING);

            return '<!-- ghostlabs-serendipity render error -->';
        }
    }
}

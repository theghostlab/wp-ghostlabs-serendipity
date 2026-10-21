<?php
/**
 * Server-side rendering of the `ghostlabs/serendipity` block.
 *
 * @package ghostlabs-serendipity
 */

use GHOSTLABS\SERENDIPITY\DTO\Input\AttributesDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\LayoutDataDto;
use GHOSTLABS\SERENDIPITY\DTO\Input\RawImageDto;
use GHOSTLABS\SERENDIPITY\Service\Serendipity;
use GHOSTLABS\SERENDIPITY\Service\DTOMapper;

if ( ! defined( 'ABSPATH' ) ) exit;

/** @var array<string, array<string, mixed>> $attributes */
$attributes = $attributes ?? [];

try {
    $nestedMappings = [
        'layoutData' => [LayoutDataDto::class],
        'rawImages' => [RawImageDto::class]
    ];

    /** @var AttributesDto $dto */
    $dto = DTOMapper::mapNested($attributes, AttributesDto::class, $nestedMappings);

    $serendipity = new Serendipity($dto);

    echo $serendipity->render();
} catch (\Throwable $e) {
    // ⚠️ Throwable, not ReflectionException. Block markup is author data, and a typed property
    // it leaves out, or an image that is not an object, throws an Error or a TypeError — which
    // fataled the whole page rather than this block (plugin audit, 2026-10-16). The cause goes
    // to the log where a developer has asked for it, never into the page.
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Serendipity] render error: ' . $e->getMessage());
    }

    echo '<!-- ghostlabs-serendipity render error -->';
}


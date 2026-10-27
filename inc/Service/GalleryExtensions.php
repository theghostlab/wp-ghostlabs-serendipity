<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Contracts\GalleryExtensionInterface;
use GHOSTLABS\SERENDIPITY\Contracts\HoverStyleInterface;
use GHOSTLABS\SERENDIPITY\Contracts\LightboxModeInterface;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The extensions an edition added to the gallery's render — see GalleryExtensionInterface.
 *
 * Empty unless an edition's boot registers one, and the render asks it nothing it cannot
 * answer empty. Static, like `PatternLibrary::provide()`: an edition registers during boot, and
 * the render service is constructed per block by a template that has nothing to inject.
 *
 * 🔴 **Deliberately not a filter.** A filter can be answered by any plugin on the site.
 */
final class GalleryExtensions
{
    /** @var array<class-string, GalleryExtensionInterface> */
    private static array $extensions = [];

    public static function extend(GalleryExtensionInterface ...$extensions): void
    {
        foreach ($extensions as $extension) {
            self::$extensions[$extension::class] = $extension;
        }
    }

    /** Test seam: forget every extension. */
    public static function reset(): void
    {
        self::$extensions = [];
    }

    /** @return array<string, HoverStyleInterface> */
    public static function hoverStyles(): array
    {
        $styles = [];

        foreach (self::$extensions as $extension) {
            $styles += $extension->hoverStyles();
        }

        return $styles;
    }

    /** @param array<string, mixed> $attributes */
    public static function lightboxMode(array $attributes): ?LightboxModeInterface
    {
        foreach (self::$extensions as $extension) {
            $mode = $extension->lightboxMode($attributes);

            if ($mode !== null) {
                return $mode;
            }
        }

        return null;
    }

    /** @param array<string, mixed> $rectangle */
    public static function tileImageCss(array $rectangle): string
    {
        $css = '';

        foreach (self::$extensions as $extension) {
            $css .= $extension->tileImageCss($rectangle);
        }

        return $css;
    }
}

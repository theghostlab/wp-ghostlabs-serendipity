<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What an edition adds to the gallery's render, on top of what every edition renders.
 *
 * The render service ships in every build, so it names nothing a single edition adds. It renders
 * the hover styles, the lightbox modes and the tile geometry every edition has, and asks the
 * extensions an edition registered (`Service\GalleryExtensions`) for anything beyond them. A build
 * that registers none renders exactly what it carries — there is nothing in it to hold back.
 *
 * ⚠️ WordPress.org Guideline 5: a free build may not carry a feature it withholds. This seam is
 * how the paid edition's features stay out of the free build entirely, rather than shipping there
 * behind a check (refused 2026-10-26). An extension decides for itself whether it applies.
 */
interface GalleryExtensionInterface
{
    /**
     * The hover styles this extension renders, keyed by their stored value.
     *
     * @return array<string, HoverStyleInterface>
     */
    public function hoverStyles(): array;

    /**
     * The lightbox mode this gallery resolves to, or null to leave it to the modes every
     * edition has.
     *
     * @param array<string, mixed> $attributes The block's attributes, as parsed.
     */
    public function lightboxMode(array $attributes): ?LightboxModeInterface;

    /**
     * CSS declarations for one tile's image, from its saved rectangle, or ''.
     *
     * Already validated: the render writes them into a `<style>` element as they are.
     *
     * @param array<string, mixed> $rectangle
     */
    public function tileImageCss(array $rectangle): string;
}

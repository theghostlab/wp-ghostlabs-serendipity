<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Contracts;

use GHOSTLABS\SERENDIPITY\DTO\Input\AttributesDto;
use GHOSTLABS\SERENDIPITY\Service\ImageAccess;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * A lightbox mode an edition adds, beyond the `Enum\Lightbox` modes every edition has.
 *
 * Those emit an anchor (or nothing) for whatever lightbox the site already runs. A mode here
 * opens something of the edition's own, so it supplies the trigger and whatever its script needs
 * from the gallery's inline store.
 */
interface LightboxModeInterface
{
    /** The value the gallery declares in `data-lightbox`, which the front-end seat matches. */
    public function value(): string;

    /**
     * What opens this mode around one tile's image.
     *
     * @param string                $image The `<img>`.
     * @param array<string, string> $name  The trigger's accessible name, as attributes.
     */
    public function trigger(string $image, array $name): string;

    /**
     * Entries for the gallery's inline store, keyed as the edition's script reads them. Encoded
     * by the render, never by the mode.
     *
     * @param array<string, mixed> $attributes The block's attributes, as parsed.
     *
     * @return array<string, mixed>
     */
    public function store(AttributesDto $gallery, array $attributes, ImageAccess $access): array;
}

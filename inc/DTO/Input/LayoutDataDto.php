<?php

namespace GHOSTLABS\SERENDIPITY\DTO\Input;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * One saved layout, for one breakpoint.
 *
 * ⚠️ Every property has a default, for the reason RawImageDto's do: nested items get no
 * block.json defaults. An entry with no breakpoint is not a layout, and `LayoutResolver` drops
 * it (`describesGallery()`), rather than the gallery being lost to an Error.
 */
class LayoutDataDto
{
    public string $deviceType = '';
    public string $aspectRatio = 'auto';

    /** @var array{
     *  rectangles: array<array{
     *      x: int,
     *      y: int,
     *      width: float,
     *      height: float,
     *      xPercent: float,
     *      yPercent: float,
     *      widthPercent: float,
     *      heightPercent: float,
     *      objectPosition: ?string
     *  }>,
     *  originalDimensions: array{
     *      width: int,
     *      height: int,
     *  },
     *  format:string,
     *  timestamp: string,
     *  totalItems: int
    }|array{} Empty for a layout a pattern wrote rather than the composer. */
    public array $rawLayoutData = [];

    /**
     * The tiles, in the order the images are rendered — `rectangles[i]` positions
     * `rawImages[i]`. Percentage keys are what a current save writes and what can be
     * re-scaled to any container; the pixel pair is the legacy form, kept because it is
     * still the composition its author approved at that width.
     *
     * @var array<int, array{
     *  x: int|float,
     *  y: int|float,
     *  width: int|float,
     *  height: int|float,
     *  xPercent?: float,
     *  yPercent?: float,
     *  widthPercent?: float,
     *  heightPercent?: float,
     *  objectPosition?: string|null
     * }>
     */
    public array $rectangles = [];

    public string $minHeight = '';
}
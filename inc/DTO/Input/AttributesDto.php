<?php

namespace GHOSTLABS\SERENDIPITY\DTO\Input;

if ( ! defined( 'ABSPATH' ) ) exit;

class AttributesDto
{
    public string $id;
    public string $gap;
    public string $thumbnailSize;
    public string $imageResolution;
    /** @var RawImageDto[] */
    public array $rawImages;
    public string $minHeight;
    public string $hoverStyle;
    public string $aspectRatio;
    public string $align;
    /**
     * Which lightbox a click opens. See the Lightbox enum for the accepted values.
     *
     * Kept alongside the legacy `carousel` boolean rather than replacing it: blocks
     * saved before this existed carry only the boolean, and resolving them at render
     * means nobody has to re-save every post that has a gallery in it.
     */
    public string $lightbox;
    public bool $carousel;
    public bool $mobileStackThumbnails;
    /** @var LayoutDataDto[] */
    public array $layoutData;
    public string $controls;
    public bool $showCarouselCaptions;

    /**
     * Slideshow autoplay, and the pause between slides in seconds.
     *
     * Only ever read for a gallery that resolved to the built-in carousel, which is
     * licensed — so this needs no gate of its own beyond the one the mode already has.
     */
    public bool $autoplay;
    public int $autoplayDelay;
    public bool $debug;
}
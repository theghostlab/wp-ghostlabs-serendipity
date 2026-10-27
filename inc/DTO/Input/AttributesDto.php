<?php

namespace GHOSTLABS\SERENDIPITY\DTO\Input;

if ( ! defined( 'ABSPATH' ) ) exit;

class AttributesDto
{
    public string $id;
    public string $gap;
    public string $thumbnailSize;
    /** @var RawImageDto[] */
    public array $rawImages;
    public string $minHeight;
    public string $hoverStyle;
    public string $aspectRatio;
    public string $align;
    /**
     * Which lightbox a click opens. See the Lightbox enum for the accepted values; a mode an
     * edition adds reads the block's attributes itself (`Contracts\LightboxModeInterface`).
     */
    public string $lightbox;
    public bool $mobileStackThumbnails;
    /** @var LayoutDataDto[] */
    public array $layoutData;
    public bool $debug;
}
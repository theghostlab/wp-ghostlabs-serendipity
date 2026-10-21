<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Boot;

use GHOSTLABS\SERENDIPITY\Config\PluginConfig;
use GHOSTLABS\SERENDIPITY\Contracts\TierBootInterface;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Resolves the edition's boot object by name.
 *
 * The edition string names the class: 'free' resolves Boot\FreeBoot. Each tier
 * directory ships its own, so the class is present exactly when that tier was
 * overlaid onto shared/ — which makes the lookup itself the check. One autoload,
 * resolved through the same two-root PSR-4 map that finds everything else, and no
 * filesystem walk on any request.
 *
 * A build whose class is missing falls back to MissingTierBoot rather than fataling.
 */
final class TierBootFactory
{
    public static function for(string $edition): TierBootInterface
    {
        $class = __NAMESPACE__ . '\\' . ucfirst(strtolower($edition)) . 'Boot';

        if (class_exists($class) && is_subclass_of($class, TierBootInterface::class)) {
            /** @var TierBootInterface */
            return new $class();
        }

        return new MissingTierBoot();
    }

    /**
     * The edition this build was assembled as.
     *
     * Read through PluginConfig::tier() rather than the constant directly, so there
     * is one place that decides what an undeclared build counts as.
     */
    public static function current(): TierBootInterface
    {
        return self::for(PluginConfig::tier());
    }
}

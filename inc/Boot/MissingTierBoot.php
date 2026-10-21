<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Boot;

use GHOSTLABS\SERENDIPITY\Contracts\TierBootInterface;
use GHOSTLABS\SERENDIPITY\Service\Loader;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Stands in when a build has no Boot\{Edition}Boot class.
 *
 * That only happens if a build was assembled wrong — the entry header declared an
 * edition whose tier directory was never overlaid. Registering nothing keeps the
 * site serving pages, and the gallery block still registers because the Kernel does
 * that itself rather than asking the edition for permission.
 *
 * The failure is therefore a plugin missing its paid features, never a white screen,
 * and never the paid feature set running with nothing behind it.
 */
final class MissingTierBoot implements TierBootInterface
{
    public function boot(Loader $loader): void
    {
        // Nothing to wire: there is no edition here to wire.
    }
}

<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Contracts;

use GHOSTLABS\SERENDIPITY\Service\Loader;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The one object an edition supplies to describe itself to the Kernel.
 *
 * Everything the Kernel wires is common to every edition; everything that is not
 * lives behind this interface. Each edition ships exactly one implementation, named
 * by convention after the edition constant, so resolving it is a single autoload
 * rather than a directory walk.
 *
 * This is what lets the Kernel live in shared/ without naming a class only one
 * edition carries — it asks the boot object to register its own services and never
 * learns what they are.
 */
interface TierBootInterface
{
    /**
     * Register the services only this edition has.
     *
     * Hooks queued on $loader run when the Kernel runs it. Anything that must be
     * registered directly — because it has to survive a failing license check, say —
     * should use add_action() here instead.
     */
    public function boot(Loader $loader): void;
}

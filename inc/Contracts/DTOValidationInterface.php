<?php

namespace GHOSTLABS\SERENDIPITY\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The rules a DTO declares for its own validation.
 *
 * Copied from wp-kit alongside `Service\DTOMapper`, which is the only thing that consumes
 * it — see that class for why the copy exists and what would retire it.
 */
interface DTOValidationInterface
{
    /**
     * @return array<string, array<string, mixed>>
     */
    static public function rules(): array;
}

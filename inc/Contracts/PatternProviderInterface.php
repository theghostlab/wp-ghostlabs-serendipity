<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * A set of block patterns an edition contributes.
 *
 * Patterns are the shop window, and the two editions do not stock the same one: the free
 * build ships four starters, the licensed build adds eight more. Rather than one list
 * with the paid half filtered out — which would put the paid patterns' markup in the free
 * build, where no code from the paid tier belongs — each edition supplies its own
 * provider and only the machinery is shared.
 */
interface PatternProviderInterface
{
    /**
     * The patterns to register on this request. A provider with nothing to offer returns none.
     *

     * @return array<string, array<string, mixed>> Pattern name (without namespace) to
     *                                             `register_block_pattern()` properties.
     */
    public function patterns(): array;
}

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
     * The capability a license has to grant before these are registered, or null when
     * they are free.
     *
     * A pattern that inserts and then renders degraded is worse than a pattern that is
     * not offered: it teaches the user that the plugin is broken rather than that the
     * edition is limited.
     */
    public function capability(): ?string;

    /**
     * @return array<string, array<string, mixed>> Pattern name (without namespace) to
     *                                             `register_block_pattern()` properties.
     */
    public function patterns(): array;
}

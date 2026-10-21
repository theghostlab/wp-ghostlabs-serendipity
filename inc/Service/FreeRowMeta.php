<?php

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The free row's other column: Docs and Support (owner, 2026-10-18; register § Upgrade prompts
 * in the free build). The convention Cycle Block and Undercard follow.
 *
 * Why it earns a place: on a WordPress.org install core shows *View details* and suppresses the
 * `Plugin URI` link (an `elseif`), so by default nothing on the row leads to the plugin's own
 * documentation.
 *
 * ⚠️ **Help links, not an upsell.** The row carries no upgrade link (owner, 2026-10-03). Docs is
 * the documentation page, not the product page, and carries no `from=`.
 *
 * Reached only for this plugin's row: `PluginRowMeta` compares the plugin file before it applies
 * the filter this answers.
 */
final class FreeRowMeta
{
    /**
     * @param array<int|string, string> $meta
     * @return array<int|string, string>
     */
    public function rowMeta(array $meta): array
    {
        $meta[] = PluginRowMeta::link(
            UpgradeEndpoints::docsUrl(),
            __('Docs', 'ghostlabs-serendipity'),
            __('Serendipity docs', 'ghostlabs-serendipity')
        );

        $meta[] = PluginRowMeta::link(
            UpgradeEndpoints::supportUrl(),
            __('Support', 'ghostlabs-serendipity'),
            __('Serendipity support forum', 'ghostlabs-serendipity')
        );

        return $meta;
    }
}

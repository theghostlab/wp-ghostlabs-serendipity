<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Boot;

use GHOSTLABS\SERENDIPITY\Contracts\TierBootInterface;
use GHOSTLABS\SERENDIPITY\Service\BlockFactory;
use GHOSTLABS\SERENDIPITY\Service\FreeRowMeta;
use GHOSTLABS\SERENDIPITY\Service\FreeSettings;
use GHOSTLABS\SERENDIPITY\Service\Loader;
use GHOSTLABS\SERENDIPITY\Service\PluginRowMeta;
use GHOSTLABS\SERENDIPITY\Service\UpgradeEndpoints;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The free edition's wiring — which is almost none, and that is the point.
 *
 * Everything this edition does lives in shared/: the gallery block, the composition
 * engine, saved layouts at every breakpoint, and the front-end render. The Kernel
 * registers all of it without asking anyone's permission.
 *
 * What the licensed edition adds has no counterpart to wire here, so this class exists
 * to answer the Kernel rather than to register services. It is a null object, not a
 * missing one: the Kernel always has an edition to boot, so it never needs to know
 * which one it got.
 *
 * What it does wire is the upsell, on the two surfaces the register allows: a settings screen
 * — not because there is anything to configure, but because the plugin's row carries a
 * Settings link and a link that goes nowhere is worse than no link (see FreeSettings) — and
 * the URLs the block's editor surfaces link to, which only this edition supplies.
 *
 * 🔴 It registers no REST routes. Until 2026-10-08 it registered two, for the in-place
 * upgrade, which WordPress.org refused (`NoInDashboardInstallTest`).
 */
final class FreeBoot implements TierBootInterface
{
    public function boot(Loader $loader): void
    {
        $settings = new FreeSettings();

        $loader->add_action('admin_menu', $settings, 'page');
        $loader->add_action('admin_enqueue_scripts', $settings, 'styles');
        $loader->add_filter(
            sprintf('plugin_action_links_%s', GHOSTLABS_SERENDIPITY_PLUGIN_SLUG),
            $settings,
            'actionLinks'
        );

        // Docs and Support, through shared's guarded seam: `plugin_row_meta` is global and fires
        // for every plugin on the screen, so it is never hooked directly.
        $loader->add_filter(PluginRowMeta::FILTER, new FreeRowMeta(), 'rowMeta');

        // The editor's upgrade links. A static offer, not a filter: a filter could be answered
        // by any plugin, and on a licensed site that would switch this pitch on.
        BlockFactory::offerUpgrade(UpgradeEndpoints::editorUrls());
    }
}

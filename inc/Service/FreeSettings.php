<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use Closure;
use GHOSTLABS\SERENDIPITY\Config\PluginConfig;
use GHOSTLABS\SERENDIPITY\Enum\UpsellSource;
use GHOSTLABS\SERENDIPITY\Render\ComparisonTable;
use GHOSTLABS\SERENDIPITY\Render\HeroBand;
use GHOSTLABS\SERENDIPITY\Render\UpgradePage;
use GHOSTLABS\SERENDIPITY\Render\UpgradePanel;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The free edition's settings screen.
 *
 * There is nothing to configure. Every setting this plugin has belongs to a gallery and
 * lives on the block, and the free edition has no license to manage — so a settings page
 * exists here for one reason: the plugin's row in the Plugins list has a Settings link,
 * and a link that goes nowhere is worse than no link.
 *
 * What it carries instead is the upsell, and WordPress.org's guideline 11 names this screen
 * as the place for it. Since 2026-10-03 it looks like the portfolio's Upsell Page (Penpot →
 * WordPress > Plugins → F3; register § Upgrade prompts in the free build): a header band, where
 * your settings live, the way in for somebody who already bought, the hero, and the comparison
 * table. No nag, no countdown, no dismissible notice that comes back. This page is only ever
 * reached deliberately.
 *
 * Deliberately plain PHP, and one stylesheet with no script. A React bundle to say "there are
 * no settings" would be the joke telling itself.
 */
final class FreeSettings
{
    /** @var Closure(): bool */
    private Closure $canUpload;

    /**
     * @param (Closure(): bool)|null $canUpload Whether this user may upload a plugin here.
     *                                          Defaults to core's `upload_plugins`, which core
     *                                          already denies to a subsite administrator on a
     *                                          network and to everybody under
     *                                          `DISALLOW_FILE_MODS`.
     */
    public function __construct(?Closure $canUpload = null)
    {
        $this->canUpload = $canUpload ?? static fn (): bool => current_user_can( 'upload_plugins' );
    }

    /**
     * The hook suffix `add_options_page()` answered, so `styles()` can tell this screen from
     * every other admin page without reconstructing the suffix by hand.
     */
    private ?string $hookSuffix = null;

    public function page(): void
    {
        $hook = add_options_page(
            __( 'Serendipity', 'ghostlabs-serendipity' ),
            __( 'Serendipity', 'ghostlabs-serendipity' ),
            'manage_options',
            PluginConfig::$settingsMenuSlug,
            [ $this, 'render' ]
        );

        $this->hookSuffix = is_string( $hook ) ? $hook : null;
    }

    /**
     * This screen's one asset, and only on this screen.
     *
     * ⚠️ Built by the monorepo's toolchain project into `free-only/assets/css/`, which
     * `build.sh` overlays; a `--dist` build compiles the same source in place. Both have to agree on the
     * path, or a release and a dev build disagree about where the stylesheet lives.
     */
    public function styles( string $hookSuffix ): void
    {
        if ( $this->hookSuffix === null || $hookSuffix !== $this->hookSuffix ) {
            return;
        }

        $version = PluginConfig::$version;


        wp_enqueue_style(
            'ghostlabs-serendipity-upsell',
            rtrim( GHOSTLABS_SERENDIPITY_PLUGIN_URL, '/' ) . '/assets/css/ghostlabs-serendipity-upsell.css',
            [],
            $version
        );
    }

    /**
     * The Settings link on the plugin's row, which is what most people will arrive by.
     *
     * @param array<int, string> $links
     * @return array<int, string>
     */
    public function actionLinks(array $links): array
    {
        $settings = sprintf(
            '<a href="%s">%s</a>',
            esc_url( admin_url( 'options-general.php?page=' . PluginConfig::$settingsMenuSlug ) ),
            esc_html__( 'Settings', 'ghostlabs-serendipity' )
        );

        array_unshift( $links, $settings );

        return $links;
    }

    public function render(): void
    {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        echo '<div class="wrap ghostlabs-s-screen">';

        // The header band names the plugin and the edition.
        //
        // ⚠️ The `wp-header-end` marker is load-bearing. Core's common.js moves every admin
        // notice to just after it, or, without it, to just after the first heading in `.wrap`
        // — which is our h1, inside the flex band, so another plugin's notice landed between
        // the title and the badge (FooBox, 2026-10-12). The marker keeps notices below the band.
        printf(
            '<div class="ghostlabs-s-screen__header"><h1 class="ghostlabs-s-screen__title">%s</h1><span class="ghostlabs-s-screen__badge">%s</span></div><hr class="wp-header-end">',
            esc_html__( 'Serendipity', 'ghostlabs-serendipity' ),
            esc_html__( 'Free', 'ghostlabs-serendipity' )
        );

        ( new UpgradePage(
            // 🔴 The way in for somebody who already bought explains three steps and does none
            // of them. See `Render\UpgradePanel`.
            new UpgradePanel(
                AccountEndpoints::accountUrl(),
                ( $this->canUpload )() ? admin_url( 'plugin-install.php?tab=upload' ) : null
            ),
            new HeroBand( UpgradeEndpoints::upgradeUrl( UpsellSource::Settings ) ),
            new ComparisonTable(),
            UpgradeEndpoints::upgradeUrl( UpsellSource::SettingsTable ),
            UpgradeEndpoints::docsUrl()
        ) )->render();

        echo '</div>';
    }
}

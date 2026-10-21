<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Render;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The way in for somebody who has already bought the licensed edition.
 *
 * It stays quiet: a single row until opened. A buyer finds it without scrolling, and nobody
 * else has it shouting at them.
 *
 * 🔴 **It explains, and it does nothing itself.** Until 2026-10-08 this screen took a key and
 * installed the licensed edition in place. WordPress.org refused that design for a sibling
 * plugin carrying the same client. Guideline 8 forbids installing a paid version of the same
 * plugin from anywhere but WordPress.org, and the review's "Changing Active Plugins" item
 * forbids a plugin switching plugins on or off. Now the buyer takes three steps, and each one
 * happens on a screen this plugin doesn't own: their account to download, core's uploader to
 * install, core's Activate link to switch over. The other edition switches this one off, and
 * it is never hosted on .org. `NoInDashboardInstallTest` holds the ban. ⚠️ Do not restore the
 * old client here.
 *
 * A native `<details>`, so there is no script at all. It is closed by default, operable from
 * the keyboard, and it opens without JavaScript.
 */
final class UpgradePanel
{
    /**
     * @param string      $downloadUrl Where the buyer downloads it: their account, on our own
     *                                 domain.
     * @param string|null $uploadUrl   Core's plugin uploader, or null where this user cannot
     *                                 upload. That means a subsite administrator on a network,
     *                                 or anyone on a site with file changes turned off.
     */
    public function __construct(
        private readonly string $downloadUrl,
        private readonly ?string $uploadUrl,
    ) {
    }

    public function render(): void
    {
        echo '<section class="ghostlabs-s-upgrade__strip ghostlabs-s-handoff">';
        echo '<details class="ghostlabs-s-handoff__details">';

        printf(
            '<summary class="ghostlabs-s-handoff__summary"><span class="ghostlabs-s-handoff__heading">%s</span>'
            . '<span class="ghostlabs-s-button ghostlabs-s-button--secondary">%s</span></summary>',
            esc_html__( 'Already own Serendipity Deluxe?', 'ghostlabs-serendipity' ),
            esc_html__( 'Have a license?', 'ghostlabs-serendipity' )
        );

        echo '<div class="ghostlabs-s-handoff__region">';

        printf(
            '<p class="ghostlabs-s-handoff__sub">%s</p>',
            esc_html__( 'Serendipity Deluxe is a separate plugin. When you activate it, it switches this plugin off, and every gallery and saved layout stays exactly as it is.', 'ghostlabs-serendipity' )
        );

        echo '<ol class="ghostlabs-s-handoff__steps">';

        printf(
            '<li><a href="%s" target="_blank" rel="noopener noreferrer">%s<span class="screen-reader-text"> %s</span></a></li>',
            esc_url( $this->downloadUrl ),
            esc_html__( 'Download Serendipity Deluxe from your account', 'ghostlabs-serendipity' ),
            esc_html__( '(opens in a new tab)', 'ghostlabs-serendipity' )
        );

        // ⚠️ The fallback names no screen: `upload_plugins` is also false under
        // DISALLOW_FILE_MODS and for a subsite administrator on a network, and neither has an
        // upload screen to be sent to (claims check, 2026-10-11).
        //
        // ⚠️ Version-neutral on purpose. Core renamed the Plugins submenu ("Add New" became
        // "Add New Plugin", then "Add Plugin"), and this plugin supports WordPress from 6.4,
        // so a menu path written here is wrong on some site that runs it.
        if ( $this->uploadUrl !== null ) {
            printf(
                '<li><a href="%s">%s</a></li>',
                esc_url( $this->uploadUrl ),
                esc_html__( 'Upload it to this site', 'ghostlabs-serendipity' )
            );
        } else {
            printf(
                '<li>%s</li>',
                esc_html__( 'Upload it to this site. Your account can\'t install plugins here, so ask whoever manages plugins on this site to install it for you.', 'ghostlabs-serendipity' )
            );
        }

        printf(
            '<li>%s</li>',
            esc_html__( 'Activate Serendipity Deluxe, then enter your license key in its settings.', 'ghostlabs-serendipity' )
        );

        echo '</ol></div></details></section>';
    }
}

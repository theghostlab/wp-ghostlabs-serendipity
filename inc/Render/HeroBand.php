<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Render;

use GHOSTLABS\SERENDIPITY\Config\TierMatrix;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The settings screen's brand hero — Upsell Page F3's wave band.
 *
 * The one piece of the screen that is not wp-admin furniture. It is inset from the content
 * column rather than full-bleed, so it reads as a panel *on* the settings screen instead of a
 * takeover *of* it.
 *
 * The gradient, the line texture and the sweep ship inside the plugin (`assets/images/upsell/`):
 * WordPress.org guideline 7 prohibits offloading assets to a remote service.
 *
 * The headline is the register's lead line (Open 5, decided 2026-10-12; the owner put it here
 * the same day, replacing the board's stand-in). Verbatim — the register is where it changes.
 */
final class HeroBand
{
    /**
     * @param string $url Built by `Service\UpgradeEndpoints::upgradeUrl()`, so it carries this
     *                    surface's source. ⚠️ No fallback: if it is empty, no link renders.
     */
    public function __construct( private readonly string $url )
    {
    }

    public function render(): void
    {
        echo '<section class="ghostlabs-s-hero">';

        // Decorative, and marked as such: backgrounds behind aria-hidden nodes rather than
        // images a screen reader has to skip past.
        echo '<div class="ghostlabs-s-hero__texture" aria-hidden="true"></div>';
        echo '<div class="ghostlabs-s-hero__sweep" aria-hidden="true"></div>';

        echo '<div class="ghostlabs-s-hero__copy">';

        printf( '<p class="ghostlabs-s-hero__eyebrow">%s</p>', esc_html( TierMatrix::paidEditionName() ) );

        printf(
            '<h2 class="ghostlabs-s-hero__headline">%s</h2>',
            esc_html__( 'Serendipity is given a space, and fills it.', 'ghostlabs-serendipity' )
        );

        // ⚠️ The counts are words, because they read better in a sentence. `HeroBandTest`
        // holds them to `TierMatrix`, so a fourth licensed style fails a test rather than
        // shipping a false sentence.
        printf(
            '<p class="ghostlabs-s-hero__sub">%s</p>',
            esc_html__( 'Every gallery, saved layout and pattern you already have — plus Layout Studio, the built-in carousel, three more hover styles and eight more patterns.', 'ghostlabs-serendipity' )
        );

        if ( $this->url !== '' ) {
            // ⚠️ The new-tab warning is part of the accessible name (WCAG 3.2.5), hidden
            // visually only because the design carries an arrow instead.
            printf(
                '<a class="ghostlabs-s-hero__pill" href="%s" target="_blank" rel="noopener noreferrer">%s'
                . '<span class="screen-reader-text"> %s</span><span aria-hidden="true"> →</span></a>',
                esc_url( $this->url ),
                esc_html( sprintf(
                    /* translators: %s: the paid edition's name. */
                    __( 'See %s', 'ghostlabs-serendipity' ),
                    TierMatrix::paidEditionName()
                ) ),
                esc_html__( '(opens in a new tab)', 'ghostlabs-serendipity' )
            );
        }

        echo '</div></section>';
    }
}

<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Render;

use GHOSTLABS\SERENDIPITY\Config\TierMatrix;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The free settings screen's body: Penpot → WordPress > Plugins → **Upsell Page** (F3), signed
 * off as Penpot → WordPress > Serendipity → *Admin — Upsell Surfaces*, board 1 (2026-10-11).
 *
 * Its shape is the argument: where your settings actually live, the quiet way in for somebody
 * who already bought, the hero that says what the paid edition is for, then the table that says
 * what you have beside what you would be buying — and the ask again, after the case is made.
 *
 * A composer only. Each section is its own renderer, so the order is the one thing this class
 * decides.
 */
final class UpgradePage
{
    /**
     * @param string $tableUrl The foot-of-table ask, from its own `from` bucket
     *                         (`UpsellSource::SettingsTable`). Empty renders no link.
     * @param string $docsUrl  The documentation, linked from the orientation card. Empty
     *                         renders no link.
     */
    public function __construct(
        private readonly UpgradePanel $panel,
        private readonly HeroBand $hero,
        private readonly ComparisonTable $table,
        private readonly string $tableUrl,
        private readonly string $docsUrl = '',
    ) {
    }

    public function render(): void
    {
        echo '<div class="ghostlabs-s-upgrade">';

        $this->orientation();
        $this->panel->render();
        $this->hero->render();

        echo '<section class="ghostlabs-s-compare">';
        $this->table->render();
        $this->foot();
        echo '</section>';

        echo '</div>';
    }

    /**
     * Where the settings are. Most people arrive from the Settings link on the plugin's row,
     * expecting settings, and the honest answer is that there are none here.
     */
    private function orientation(): void
    {
        echo '<section class="ghostlabs-s-upgrade__card">';

        printf( '<h2 class="ghostlabs-s-upgrade__card-title">%s</h2>', esc_html__( 'Where your settings live', 'ghostlabs-serendipity' ) );

        printf(
            '<p>%s</p>',
            esc_html__( 'Every setting lives on the gallery itself. Add a Serendipity Gallery block to a post or page, and its settings are in the block sidebar — there is nothing to configure here.', 'ghostlabs-serendipity' )
        );

        printf(
            '<p>%s</p>',
            esc_html( sprintf(
                /* translators: %s: the paid edition's name. */
                __( '%s adds Layout Studio, a built-in carousel and the full pattern library — what it includes is below.', 'ghostlabs-serendipity' ),
                TierMatrix::paidEditionName()
            ) )
        );

        // Implementation spec A.5: this screen links the docs. The people who arrive here
        // looking for settings are exactly who the docs page is for. No attribution — it is
        // not an ask.
        if ( $this->docsUrl !== '' ) {
            printf(
                '<p><a href="%s" target="_blank" rel="noopener noreferrer">%s<span class="screen-reader-text"> %s</span></a></p>',
                esc_url( $this->docsUrl ),
                esc_html__( 'Read the Serendipity docs', 'ghostlabs-serendipity' ),
                esc_html__( '(opens in a new tab)', 'ghostlabs-serendipity' )
            );
        }

        echo '</section>';
    }

    /**
     * The ask, repeated at the foot of the table. The table is tall enough to push the hero's
     * link off-screen, so the offer comes again — the same offer, a different reading of the
     * screen, and therefore its own attribution bucket.
     *
     * ⚠️ "Pricing and the full feature tour live on the product page" was claims-checked TRUE
     * against the marketing site's `feature/serendipity-sales-page` on 2026-10-12: $49 / $147 and
     * all five licensed capabilities. It stays true only while that page is live, so the free
     * release must not ship before `/serendipity` is deployed to production.
     */
    private function foot(): void
    {
        echo '<div class="ghostlabs-s-compare__foot"><div class="ghostlabs-s-compare__note">';

        printf( '<p class="ghostlabs-s-compare__note-title">%s</p>', esc_html__( 'Ready when you are', 'ghostlabs-serendipity' ) );
        printf( '<p>%s</p>', esc_html__( 'Pricing and the full feature tour live on the product page.', 'ghostlabs-serendipity' ) );

        echo '</div>';

        if ( $this->tableUrl !== '' ) {
            printf(
                '<a class="ghostlabs-s-button ghostlabs-s-button--primary ghostlabs-s-button--large" href="%s" target="_blank" rel="noopener noreferrer">%s'
                . '<span class="screen-reader-text"> %s</span><span aria-hidden="true"> →</span></a>',
                esc_url( $this->tableUrl ),
                esc_html( sprintf(
                    /* translators: %s: the paid edition's name. */
                    __( 'See %s', 'ghostlabs-serendipity' ),
                    TierMatrix::paidEditionName()
                ) ),
                esc_html__( '(opens in a new tab)', 'ghostlabs-serendipity' )
            );
        }

        echo '</div>';
    }
}

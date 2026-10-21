<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Render;

use GHOSTLABS\SERENDIPITY\Config\TierMatrix;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What the free edition includes, beside what the paid one adds.
 *
 * ⚠️ **A renderer, not a declaration.** Every label, count and verdict comes from
 * `Config\TierMatrix`; nothing here restates a capability or names an edition. The drift this
 * closes is a screen that says "everything" six lines above a control that withholds three
 * things.
 *
 * A real `<table>` with `th[scope]` on both axes, so every cell is announced with the feature
 * and the edition it belongs to.
 */
final class ComparisonTable
{
    /**
     * The two marks, 20×20.
     *
     * ⚠️ The marks ARE the answer of their cell, so they are graphical objects that need 3:1
     * against the ground (WCAG 1.4.11) — and axe cannot see that, because it reads text, not
     * SVG fills. The color lives in the stylesheet (`--ghostlabs-s-muted`, gray-500, 4.83:1),
     * and the E2E spec measures the computed color of every mark.
     */
    private const CHECK = 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z';

    private const CROSS = 'M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z';

    public function render(): void
    {
        echo '<table class="ghostlabs-s-compare__table">';

        printf(
            '<caption class="screen-reader-text">%s</caption>',
            esc_html( sprintf(
                /* translators: %s: the paid edition's name. */
                __( 'What the free edition includes, and what %s adds', 'ghostlabs-serendipity' ),
                TierMatrix::paidEditionName()
            ) )
        );

        printf(
            '<thead><tr><th scope="col" class="ghostlabs-s-compare__feature"><span class="screen-reader-text">%s</span></th>'
            . '<th scope="col" class="ghostlabs-s-compare__free">%s</th>'
            . '<th scope="col" class="ghostlabs-s-compare__paid">%s</th></tr></thead>',
            esc_html__( 'Feature', 'ghostlabs-serendipity' ),
            esc_html__( 'Free', 'ghostlabs-serendipity' ),
            esc_html( TierMatrix::paidEditionBadge() )
        );

        echo '<tbody>';

        foreach ( TierMatrix::capabilities() as $capability ) {
            printf(
                '<tr data-capability="%s"><th scope="row">%s</th><td class="ghostlabs-s-compare__free">',
                esc_attr( $capability['key'] ),
                esc_html( $capability['label'] )
            );
            $this->cell( $capability['free'], true );
            echo '</td><td class="ghostlabs-s-compare__paid">';
            $this->cell( $capability['paid'], false );
            echo '</td></tr>';
        }

        echo '</tbody></table>';
    }

    /**
     * A verdict or a count. A count is rendered as itself: the registry models
     * `true | false | string` so a row where free gets part of something can say which part.
     */
    private function cell( bool|string $value, bool $muted ): void
    {
        if ( is_string( $value ) ) {
            echo esc_html( $value );

            return;
        }

        printf(
            '<svg class="ghostlabs-s-compare__mark%s" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">'
            . '<path fill-rule="evenodd" clip-rule="evenodd" d="%s"/></svg>'
            . '<span class="screen-reader-text">%s</span>',
            ( $muted || ! $value ) ? ' ghostlabs-s-compare__mark--muted' : '',
            esc_attr( $value ? self::CHECK : self::CROSS ),
            esc_html( $value ? __( 'Included', 'ghostlabs-serendipity' ) : __( 'Not included', 'ghostlabs-serendipity' ) )
        );
    }
}

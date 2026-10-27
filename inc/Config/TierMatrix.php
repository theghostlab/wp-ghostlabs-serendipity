<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Config;

use GHOSTLABS\SERENDIPITY\Patterns\FreePatterns;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What each edition includes — declared once, so the surfaces that state it can agree.
 *
 * The free/paid line is stated on the settings screen's comparison table and in the readme. A
 * sibling plugin's restatements drifted three times before anybody noticed. So the facts live
 * here, and tests hold them in both directions: `TierMatrixTest` against what the paid edition
 * carries and the pattern providers, `ReadmeTierClaimsTest` against `readme.txt`.
 *
 * ## ⚠️ A fact registry, not a copy system
 *
 * Capability names, which edition has them and how many. The prose stays on its surface: the
 * hero's sentence, the readme's description. Good copy is written for the surface it is on.
 *
 * ## ⚠️ Quantities are modeled, not flattened to ✓/✗
 *
 * A value is `true`, `false` or a string stating how many. A free count is composed from what
 * already knows it (`FreePatterns`); a paid count is stated, because the free build does not
 * carry what would know it, and `TierMatrixTest` holds it in the suite that can see both. The
 * readme once said "Two hover styles" while this table said one, because one counted None and
 * one did not. None is not a style; the count is of effects.
 *
 * ## ⚠️ Labels resolve at call time, and nothing here is memoized
 *
 * This class is loaded early and rendered late. A cached or constant translated label bakes in
 * whichever locale registered first. `TierMatrixTest` changes the translation between two calls.
 *
 * ## In `shared/`
 *
 * Its first reader is the free settings screen, but the facts describe both editions, and the
 * other edition's own screens will want to say what a customer has without a second copy.
 */
final class TierMatrix
{
    /**
     * How many block patterns the licensed edition registers in all.
     *
     * ⚠️ The one count this class cannot compose, because the free build does not carry the
     * provider that registers the rest. `TierMatrixTest` holds it to both providers, in the
     * suite that can see them.
     */
    private const PAID_PATTERN_COUNT = 12;

    /** How many hover styles the paid edition renders in all, None not counted. Held like the above. */
    private const PAID_HOVER_STYLE_COUNT = 4;

    /** The paid edition's customer-facing name. One accessor, so a rename is one file. */
    public static function paidEditionName(): string
    {
        return __( 'Serendipity Deluxe', 'ghostlabs-serendipity' );
    }

    /**
     * The same edition as a column head or a badge, one word wide. A second string rather
     * than a truncation of the first, because a sentence needs the full name.
     */
    public static function paidEditionBadge(): string
    {
        return __( 'Deluxe', 'ghostlabs-serendipity' );
    }

    /** Fade-Up. None is not counted: it is the absence of a style. */
    public static function freeHoverStyleCount(): int
    {
        return 1;
    }

    public static function paidHoverStyleCount(): int
    {
        return self::PAID_HOVER_STYLE_COUNT;
    }

    public static function freePatternCount(): int
    {
        return count( FreePatterns::SLUGS );
    }

    public static function paidPatternCount(): int
    {
        return self::PAID_PATTERN_COUNT;
    }

    /**
     * Every row, in the order the comparison table states them: what both editions have,
     * then what the paid one adds. The order is the shape of the argument.
     *
     * `free` and `paid` are `true`, `false`, or a count. A row where they are the same is one
     * both editions share.
     *
     * ⚠️ The column key is `paid`, not the edition's name. A key is not copy, and an
     * identifier spelling out another edition would be a leak in every file that touched it.
     *
     * @return list<array{key: string, label: string, free: bool|string, paid: bool|string}>
     */
    public static function capabilities(): array
    {
        return [
            [
                'key'        => 'mosaic',
                'label'      => __( 'Generative mosaic, composed fresh until you keep one', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                // ⚠️ "three" is words, not a count, because it reads better and was the
                // claims-checked wording. `TierMatrixTest` holds it to the Breakpoint enum.
                'key'        => 'saved-layouts',
                'label'      => __( 'Saved layouts at all three breakpoints', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                'key'        => 'own-lightbox',
                'label'      => __( 'Links your own lightbox plugin can pick up, or no links at all', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                'key'        => 'hover-styles',
                'label'      => __( 'Hover styles', 'ghostlabs-serendipity' ),
                'free'       => (string) self::freeHoverStyleCount(),
                'paid'       => (string) self::paidHoverStyleCount(),
            ],
            [
                'key'        => 'patterns',
                'label'      => __( 'Block patterns', 'ghostlabs-serendipity' ),
                'free'       => (string) self::freePatternCount(),
                'paid'       => (string) self::paidPatternCount(),
            ],
            [
                'key'        => 'built-in-lightbox',
                'label'      => __( 'Built-in carousel lightbox, with captions and autoplay', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
            [
                'key'        => 'layout-studio',
                'label'      => __( 'Layout Studio — drag the seams to resize tiles, drag one tile onto another to swap them', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
            [
                'key'        => 'reframe',
                'label'      => __( 'Reframe a photograph inside its tile', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
        ];
    }
}

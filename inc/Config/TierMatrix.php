<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Config;

use GHOSTLABS\SERENDIPITY\Patterns\FreePatterns;
use GHOSTLABS\SERENDIPITY\Service\Capabilities;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * What each edition includes — declared once, so the surfaces that state it can agree.
 *
 * The free/paid line is stated on the settings screen's comparison table, in the readme and in
 * the editor's refusal copy, and enforced by `Service\Capabilities`. A sibling plugin's
 * restatements drifted three times before anybody noticed. So the facts live here, and tests
 * hold them in both directions: `TierMatrixTest` against `Capabilities` and the pattern
 * providers, `ReadmeTierClaimsTest` against `readme.txt`.
 *
 * ## ⚠️ A fact registry, not a copy system
 *
 * Capability names, which edition has them and how many. The prose stays on its surface: the
 * hero's sentence, the readme's description. Good copy is written for the surface it is on.
 *
 * ## ⚠️ Quantities are modeled, not flattened to ✓/✗
 *
 * A value is `true`, `false` or a string stating how many, and every count is composed from
 * what already knows it (`Capabilities`, `FreePatterns`), never typed. The readme once said
 * "Two hover styles" while this table said one, because one counted None and one did not.
 * None is not a style; the count is of effects.
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
        return self::freeHoverStyleCount() + count( Capabilities::LICENSED_HOVER_STYLES );
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
     * `capability` is the gated slug a row sells, or null for a row both editions share.
     * `free` and `paid` are `true`, `false`, or a count.
     *
     * ⚠️ The column key is `paid`, not the edition's name. A key is not copy, and an
     * identifier spelling out another edition would be a leak in every file that touched it.
     *
     * @return list<array{key: string, capability: ?string, label: string, free: bool|string, paid: bool|string}>
     */
    public static function capabilities(): array
    {
        return [
            [
                'key'        => 'mosaic',
                'capability' => null,
                'label'      => __( 'Generative mosaic, composed fresh until you keep one', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                // ⚠️ "three" is words, not a count, because it reads better and was the
                // claims-checked wording. `TierMatrixTest` holds it to the Breakpoint enum.
                'key'        => 'saved-layouts',
                'capability' => null,
                'label'      => __( 'Saved layouts at all three breakpoints', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                'key'        => 'own-lightbox',
                'capability' => null,
                'label'      => __( 'Links your own lightbox plugin can pick up, or no links at all', 'ghostlabs-serendipity' ),
                'free'       => true,
                'paid'       => true,
            ],
            [
                'key'        => 'hover-styles',
                'capability' => Capabilities::HOVER_STYLES_EXTENDED,
                'label'      => __( 'Hover styles', 'ghostlabs-serendipity' ),
                'free'       => (string) self::freeHoverStyleCount(),
                'paid'       => (string) self::paidHoverStyleCount(),
            ],
            [
                'key'        => 'patterns',
                'capability' => Capabilities::PATTERN_LIBRARY,
                'label'      => __( 'Block patterns', 'ghostlabs-serendipity' ),
                'free'       => (string) self::freePatternCount(),
                'paid'       => (string) self::paidPatternCount(),
            ],
            [
                'key'        => 'built-in-lightbox',
                'capability' => Capabilities::BUILT_IN_LIGHTBOX,
                'label'      => __( 'Built-in carousel lightbox, with captions and autoplay', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
            [
                'key'        => 'layout-studio',
                'capability' => Capabilities::LAYOUT_STUDIO,
                'label'      => __( 'Layout Studio — drag the seams to resize tiles, drag one tile onto another to swap them', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
            [
                'key'        => 'reframe',
                'capability' => Capabilities::PAN_TILT,
                'label'      => __( 'Reframe a photograph inside its tile', 'ghostlabs-serendipity' ),
                'free'       => false,
                'paid'       => true,
            ],
        ];
    }
}

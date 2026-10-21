<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Patterns;

use GHOSTLABS\SERENDIPITY\Contracts\PatternProviderInterface;
use GHOSTLABS\SERENDIPITY\Service\PatternBuilder;
use GHOSTLABS\SERENDIPITY\Service\PatternLayout;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The four starter patterns every edition ships.
 *
 * They use only settings the free edition has: no built-in carousel, and only the two
 * free hover styles — none, and Fade-Up. A starter pattern that inserted a locked
 * feature would be an upsell trap: the user would see a control they cannot use inside
 * something the plugin handed them, which reads as a bug and costs a rating.
 */
final class FreePatterns implements PatternProviderInterface
{
    /**
     * The names `patterns()` registers, in order — what `Config\TierMatrix` counts without
     * building any markup. `TierMatrixTest` holds the two together.
     */
    public const SLUGS = ['triptych', 'photo-essay', 'hero-mosaic', 'sidebar-story'];

    public function capability(): ?string
    {
        return null;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function patterns(): array
    {
        return [
            'triptych'      => $this->triptych(),
            'photo-essay'   => $this->photoEssay(),
            'hero-mosaic'   => $this->heroMosaic(),
            'sidebar-story' => $this->sidebarStory(),
        ];
    }

    /**
     * Three across, generous gap, nothing else. The simplest thing the block does, and
     * the one most likely to be inserted by someone finding out what it is.
     *
     * @return array<string, mixed>
     */
    private function triptych(): array
    {
        return [
            'title'         => __('Triptych', 'ghostlabs-serendipity'),
            'description'   => __('Three images across, with a generous gap.', 'ghostlabs-serendipity'),
            'keywords'      => ['gallery', 'three', 'triptych', 'row'],
            'viewportWidth' => 1400,
            'content'       => PatternBuilder::gallery([
                'count'     => 3,
                'align'     => 'wide',
                'gap'       => '8px',
                'minHeight' => '520px',
                'layouts'   => [
                    'Desktop' => [[1, [1, 1, 1]]],
                    'Tablet'  => [[1, [1, 1, 1]]],
                    'Mobile'  => PatternLayout::grid(3, 1),
                ],
            ]),
        ];
    }

    /**
     * A heading, an introduction, a full-bleed mosaic and a credit line — the shape of a
     * magazine spread, and the layout the block was built for.
     *
     * @return array<string, mixed>
     */
    private function photoEssay(): array
    {
        return [
            'title'         => __('Photo Essay', 'ghostlabs-serendipity'),
            'description'   => __('A heading, an introduction and a full-bleed mosaic of seven images.', 'ghostlabs-serendipity'),
            'keywords'      => ['gallery', 'essay', 'editorial', 'mosaic', 'story'],
            'viewportWidth' => 1400,
            'content'       =>
                PatternBuilder::heading(__('A Week of Mornings', 'ghostlabs-serendipity'))
                . PatternBuilder::paragraph(
                    __('Seven days, one hour each. Replace these with your own photographs and the composition stays exactly where you put it.', 'ghostlabs-serendipity')
                )
                . PatternBuilder::gallery([
                    'count'      => 7,
                    'align'      => 'full',
                    'gap'        => '4px',
                    'minHeight'  => '760px',
                    'hoverStyle' => 'style-1',
                    'layouts'    => [
                        'Desktop' => [[1.35, [2, 1, 1]], [1, [1, 1, 1, 1]]],
                        'Tablet'  => [[1.2, [2, 1]], [1, [1, 1]], [1, [1, 1, 1]]],
                        'Mobile'  => PatternLayout::grid(7, 2),
                    ],
                ])
                . PatternBuilder::paragraph(
                    __('Photographs by you. Add a caption to each image and it appears on hover.', 'ghostlabs-serendipity'),
                    ['fontSize' => 'small']
                ),
        ];
    }

    /**
     * One dominant tile carrying three smaller ones. The composition to reach for when
     * the gallery is the first thing on the page.
     *
     * @return array<string, mixed>
     */
    private function heroMosaic(): array
    {
        return [
            'title'         => __('Hero Mosaic', 'ghostlabs-serendipity'),
            'description'   => __('A full-bleed opener built around one dominant image.', 'ghostlabs-serendipity'),
            'keywords'      => ['gallery', 'hero', 'header', 'mosaic', 'feature'],
            'viewportWidth' => 1400,
            'content'       => PatternBuilder::gallery([
                'count'      => 5,
                'align'      => 'full',
                'gap'        => '4px',
                'minHeight'  => '820px',
                'hoverStyle' => 'style-1',
                'layouts'    => [
                    'Desktop' => [[2.1, [1.9, 1]], [1, [1, 1, 1]]],
                    'Tablet'  => [[1.8, [1]], [1, [1, 1]], [1, [1, 1]]],
                    'Mobile'  => [[1.6, [1]], [1, [1, 1]], [1, [1, 1]]],
                ],
            ]),
        ];
    }

    /**
     * Text and mosaic side by side. The gallery sits inside a column, so it takes no
     * alignment of its own — an aligned block inside a column fights its parent.
     *
     * @return array<string, mixed>
     */
    private function sidebarStory(): array
    {
        $prose =
            PatternBuilder::heading(__('From the Archive', 'ghostlabs-serendipity'), 3)
            . PatternBuilder::paragraph(
                __('A short piece of writing beside the pictures it belongs to. The mosaic keeps its own proportions as the column narrows, and rearranges when the layout stacks.', 'ghostlabs-serendipity')
            );

        return [
            'title'         => __('Sidebar Story', 'ghostlabs-serendipity'),
            'description'   => __('Writing on the left, a six-image mosaic on the right.', 'ghostlabs-serendipity'),
            'keywords'      => ['gallery', 'columns', 'sidebar', 'story', 'text'],
            'viewportWidth' => 1400,
            'content'       => PatternBuilder::columns(
                [
                    $prose,
                    PatternBuilder::gallery([
                        'count'     => 6,
                        'gap'       => '4px',
                        'minHeight' => '620px',
                        // Cut for the column, not the page: 60% of a 645px content
                        // column (WordPress's default theme) less the column gap. Cut
                        // for 1400px, the gutter between its columns drew at 1px.
                        'width'     => 380,
                        'layouts'   => [
                            'Desktop' => PatternLayout::grid(6, 2),
                            'Tablet'  => PatternLayout::grid(6, 2),
                            'Mobile'  => PatternLayout::grid(6, 2),
                        ],
                    ]),
                ],
                [40, 60]
            ),
        ];
    }
}

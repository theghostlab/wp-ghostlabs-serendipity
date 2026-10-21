<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The gutter is painted, never stored.
 *
 * A saved layout is a partition of the gallery: tiles edge to edge, in percentages. The
 * gap is applied when the tiles are placed, half off each side of every inner edge, so
 * it is the gallery's Gap Size at any width and moves when that setting does.
 *
 * ⚠️ Every layout saved before 2026-10-13 carries its gutters inside its percentages —
 * at whatever width it was saved, and the composer's own margins with them. `cells()`
 * closes them on read, so those layouts need no migration. `_lib/gutters.js` is the JS
 * half and every frame after the first; the two must agree to the pixel, or a gallery
 * shifts once the script runs. Change one, change both, and both tests share one table.
 */
final class Gutters
{
    /** How close two edges (in percent) must be to count as touching. */
    private const EPSILON = 0.01;

    /**
     * Close every gutter at its midpoint, and send an edge with nothing beyond it to the
     * border — in a partition, only the border has nothing beyond it.
     *
     * @param array<array<string, mixed>> $rects Rectangles with `xPercent` … `heightPercent`.
     * @return array<array<string, mixed>> The same rectangles as cells, every other key
     *                                     kept. Anything not in percentages comes back as given.
     */
    public static function cells(array $rects): array
    {
        if ($rects === [] || ! isset($rects[0]['xPercent'])) {
            return $rects;
        }

        $boxes = array_map(
            static fn(array $rect): array => [
                'left'   => (float) $rect['xPercent'],
                'top'    => (float) $rect['yPercent'],
                'right'  => (float) $rect['xPercent'] + (float) $rect['widthPercent'],
                'bottom' => (float) $rect['yPercent'] + (float) $rect['heightPercent'],
            ],
            array_values($rects)
        );

        $cells = [];

        foreach (array_values($rects) as $index => $rect) {
            $box = $boxes[$index];
            $beside = [];
            $across = [];

            foreach ($boxes as $other => $candidate) {
                if ($other === $index) {
                    continue;
                }

                if (self::overlaps($box['top'], $box['bottom'], $candidate['top'], $candidate['bottom'])) {
                    $beside[] = $candidate;
                }

                if (self::overlaps($box['left'], $box['right'], $candidate['left'], $candidate['right'])) {
                    $across[] = $candidate;
                }
            }

            $left   = self::before(array_column($beside, 'right'), $box['left']);
            $right  = self::after(array_column($beside, 'left'), $box['right']);
            $top    = self::before(array_column($across, 'bottom'), $box['top']);
            $bottom = self::after(array_column($across, 'top'), $box['bottom']);

            $cells[] = array_merge($rect, [
                'xPercent'      => $left,
                'yPercent'      => $top,
                'widthPercent'  => $right - $left,
                'heightPercent' => $bottom - $top,
            ]);
        }

        return $cells;
    }

    /**
     * What a cell gives up to the gutters, in pixels: half the gap off each inner edge,
     * nothing off the border.
     *
     * @param array<string, mixed> $cell A cell, from `cells()`.
     * @return array{0: float, 1: float, 2: float, 3: float} Left, top, right, bottom.
     */
    public static function insets(array $cell, float $gap): array
    {
        $half = max(0.0, $gap) / 2;
        $x = (float) $cell['xPercent'];
        $y = (float) $cell['yPercent'];

        return [
            self::inner($x) ? $half : 0.0,
            self::inner($y) ? $half : 0.0,
            self::inner($x + (float) $cell['widthPercent']) ? $half : 0.0,
            self::inner($y + (float) $cell['heightPercent']) ? $half : 0.0,
        ];
    }

    private static function overlaps(float $fromA, float $toA, float $fromB, float $toB): bool
    {
        return min($toA, $toB) - max($fromA, $fromB) > self::EPSILON;
    }

    /**
     * @param array<float> $edges
     */
    private static function before(array $edges, float $at): float
    {
        $found = array_filter($edges, static fn(float $edge): bool => $edge <= $at + self::EPSILON);

        return $found === [] ? 0.0 : (max($found) + $at) / 2;
    }

    /**
     * @param array<float> $edges
     */
    private static function after(array $edges, float $at): float
    {
        $found = array_filter($edges, static fn(float $edge): bool => $edge >= $at - self::EPSILON);

        return $found === [] ? 100.0 : (min($found) + $at) / 2;
    }

    /** An edge inside the box, in percent, rather than on its border. */
    private static function inner(float $at): bool
    {
        return $at > self::EPSILON && $at < 100 - self::EPSILON;
    }
}

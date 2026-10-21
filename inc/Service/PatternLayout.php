<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Enum\Breakpoint;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Authored compositions for the block patterns.
 *
 * A pattern that ships no layout composes itself randomly on insert, which makes the
 * inserter preview a different gallery every time it is opened and turns a designed
 * pattern into a lucky dip. These build the rectangles by hand instead, from rows of
 * weights — `[[1.6, [2, 1]], [1, [1, 1, 1]]]` is a tall row of a wide tile and a narrow
 * one over a shorter row of three equals.
 *
 * Weights, not percentages, so a composition can be read at a glance and edited without
 * arithmetic. Everything is normalized to the container here, which is what makes it
 * survive any screen: see LayoutResolver for how a breakpoint with no composition of its
 * own borrows one.
 */
final class PatternLayout
{
    /**
     * The width a wide or full gallery is cut for, and the pixel mirror is measured against.
     * A gallery that renders narrower — one in a column — passes its own.
     */
    public const NOMINAL_WIDTH = 1400;

    /**
     * ⚠️ The gutter is the pattern's own gap, as a share of the nominal box: across, of
     * the width the gallery is cut for; down, of the min-height. A saved layout carries its gutters inside its
     * percentages, so they are exact at that box and scale with the gallery from there.
     * It was a flat 0.7% on both axes until 2026-10-12 — 12px between columns of a 4px
     * gallery in a wide editor, which jumped to 4px the first time the tiles were
     * repainted at the real gap.
     *
     * @param array<array{0: float, 1: array<float>}> $rows Height weight, then width weights.
     * @param string                                  $gap   The gallery's gap, e.g. '4px'.
     * @param float                                   $width The width it is cut for, in px.
     * @return array<array<string, float>> Rectangles, in tile order.
     */
    public static function rows(
        array $rows,
        string $minHeight = '720px',
        string $gap = '2px',
        float $width = self::NOMINAL_WIDTH
    ): array {
        $height = (float) $minHeight ?: 720.0;
        $width = $width > 0 ? $width : self::NOMINAL_WIDTH;
        $gapPx = max(0.0, (float) $gap);
        $acrossGutter = $gapPx / $width * 100;
        $downGutter = $gapPx / $height * 100;

        $heightWeights = array_sum(array_column($rows, 0));
        $verticalGutters = $downGutter * (count($rows) - 1);
        $available = 100 - $verticalGutters;

        $rectangles = [];
        $y = 0.0;

        foreach ($rows as [$rowWeight, $columns]) {
            $rowHeight = $available * ($rowWeight / $heightWeights);
            $columnWeights = array_sum($columns);
            $horizontalGutters = $acrossGutter * (count($columns) - 1);
            $rowWidth = 100 - $horizontalGutters;

            $x = 0.0;

            foreach ($columns as $columnWeight) {
                $tileWidth = $rowWidth * ($columnWeight / $columnWeights);

                $rectangles[] = self::rectangle($x, $y, $tileWidth, $rowHeight, $width, $height);

                $x += $tileWidth + $acrossGutter;
            }

            $y += $rowHeight + $downGutter;
        }

        return $rectangles;
    }

    /**
     * An even grid — the fallback shape for a narrow breakpoint, where an authored
     * composition rarely survives being squeezed.
     *
     * @return array<array{0: float, 1: array<float>}>
     */
    public static function grid(int $count, int $columns): array
    {
        $rows = [];

        for ($placed = 0; $placed < $count; $placed += $columns) {
            $rows[] = [1.0, array_fill(0, (int) min($columns, $count - $placed), 1.0)];
        }

        return $rows;
    }

    /**
     * The `layoutData` attribute: one entry per breakpoint that has a composition.
     *
     * Only Desktop is required. A breakpoint left out is borrowed from the nearest one
     * that is present, which is the behavior §5.3 added — but a pattern is a shop
     * window, so the sets below give the narrow widths their own arrangement rather than
     * a four-across contact sheet squeezed onto a phone.
     *
     * @param array<string, array<array{0: float, 1: array<float>}>> $spec Breakpoint to rows.
     * @param string                                                  $gap   The gallery's gap.
     * @param float                                                   $width The width it is cut for.
     * @return array<array<string, mixed>>
     */
    public static function layouts(
        array $spec,
        string $minHeight = '720px',
        string $gap = '2px',
        float $width = self::NOMINAL_WIDTH
    ): array
    {
        $layouts = [];

        foreach ($spec as $device => $rows) {
            $breakpoint = Breakpoint::fromDeviceType($device);

            if ($breakpoint === null) {
                continue;
            }

            $layouts[] = [
                'deviceType'  => $breakpoint->value,
                'aspectRatio' => 'auto',
                'minHeight'   => $minHeight,
                'rectangles'  => self::rows($rows, $minHeight, $gap, $width),
                'rawLayoutData' => [],
            ];
        }

        return $layouts;
    }

    /**
     * @return array<string, float>
     */
    private static function rectangle(
        float $x,
        float $y,
        float $width,
        float $height,
        float $containerWidth,
        float $containerHeight
    ): array
    {
        return [
            // The pixel mirror. Nothing reads it — the percentages are what scale — but
            // the saved shape has always carried both, and a layout that lost half of it
            // on the way through a pattern would look like corruption.
            'x'      => round($containerWidth * $x / 100, 2),
            'y'      => round($containerHeight * $y / 100, 2),
            'width'  => round($containerWidth * $width / 100, 2),
            'height' => round($containerHeight * $height / 100, 2),

            'xPercent'      => round($x, 4),
            'yPercent'      => round($y, 4),
            'widthPercent'  => round($width, 4),
            'heightPercent' => round($height, 4),
        ];
    }
}

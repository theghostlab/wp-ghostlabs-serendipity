<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\DTO\Input\LayoutDataDto;
use GHOSTLABS\SERENDIPITY\Enum\Breakpoint;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Which saved layout a breakpoint should render with — the PHP half of the rule.
 *
 * `_lib/layoutResolution.js` is the other half, and they have to give the same answer:
 * the server paints the first frame from this, the bundle re-derives it on resize, and a
 * disagreement between them is a gallery that visibly rearranges itself once the JS
 * loads. Same rule, stated twice, tested twice — the duplication is deliberate and the
 * two test suites use the same table.
 *
 * The rule: an exact match wins in whatever format it was saved in. Failing that, the
 * nearest breakpoint whose rectangles are percentage-based, since only those can be
 * re-scaled to a different container; and on a tie — Tablet, with Mobile and Desktop both
 * saved — the wider one, because a composition authored at Desktop is the one an author
 * thinks of as the gallery. Anything whose rectangle count no longer matches the images
 * is discarded rather than mapped positionally onto the wrong tiles.
 */
final class LayoutResolver
{
    /**
     * @param array<LayoutDataDto> $layoutData
     */
    public function __construct(private readonly array $layoutData, private readonly int $itemCount) {}

    /**
     * @return array{layout: LayoutDataDto|null, borrowed: bool}
     */
    public function forBreakpoint(Breakpoint $breakpoint): array
    {
        $usable = array_values(array_filter(
            $this->layoutData,
            fn (mixed $entry): bool => $this->describesGallery($entry)
        ));

        foreach ($usable as $entry) {
            if (Breakpoint::fromDeviceType($entry->deviceType) === $breakpoint) {
                return ['layout' => $entry, 'borrowed' => false];
            }
        }

        $scalable = array_values(array_filter($usable, fn (LayoutDataDto $entry): bool => $this->isScalable($entry)));

        usort($scalable, function (LayoutDataDto $a, LayoutDataDto $b) use ($breakpoint): int {
            $left  = Breakpoint::from($a->deviceType);
            $right = Breakpoint::from($b->deviceType);

            return ($left->distanceTo($breakpoint) <=> $right->distanceTo($breakpoint))
                ?: ($right->position() <=> $left->position());
        });

        return $scalable === []
            ? ['layout' => null, 'borrowed' => false]
            : ['layout' => $scalable[0], 'borrowed' => true];
    }

    /**
     * Every breakpoint that has geometry to paint, resolved.
     *
     * @return array<string, array{layout: LayoutDataDto, borrowed: bool}> Keyed by breakpoint value.
     */
    public function all(): array
    {
        $resolved = [];

        foreach (Breakpoint::ordered() as $breakpoint) {
            $result = $this->forBreakpoint($breakpoint);

            if ($result['layout'] !== null) {
                $resolved[$breakpoint->value] = $result;
            }
        }

        return $resolved;
    }

    private function describesGallery(mixed $entry): bool
    {
        return $entry instanceof LayoutDataDto
            && Breakpoint::fromDeviceType($entry->deviceType) !== null
            && count($entry->rectangles) === $this->itemCount
            && $this->itemCount > 0;
    }

    /**
     * Percentages of the container, rather than the legacy pixel form. Only these can be
     * borrowed across breakpoints — pixel geometry authored at 1440px means nothing at
     * 390px — and only these can be expressed as CSS the server can emit at all.
     */
    private function isScalable(LayoutDataDto $entry): bool
    {
        $first = $entry->rectangles[0] ?? null;

        return is_array($first) && isset($first['xPercent']);
    }
}

<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Enum;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The three widths a layout can be saved for.
 *
 * The names are the ones the editor writes into `layoutData.deviceType` and the widths
 * are the ones `getDeviceType()` switches on in the front-end bundle. Both halves have to
 * agree — the server paints the first frame from these media queries and the JS takes
 * over on the first resize — so the thresholds live here and are mirrored in
 * `_lib/layoutResolution.js`, with the cases covered by the same table in both suites.
 */
enum Breakpoint: string
{
    case Mobile  = 'Mobile';
    case Tablet  = 'Tablet';
    case Desktop = 'Desktop';

    /**
     * Narrow to wide. The index is the distance metric: Tablet is one step from either
     * neighbor, Mobile is two from Desktop.
     *
     * @return array<self>
     */
    public static function ordered(): array
    {
        return [self::Mobile, self::Tablet, self::Desktop];
    }

    public static function fromDeviceType(?string $value): ?self
    {
        return self::tryFrom((string) $value);
    }

    /**
     * The media query that matches this breakpoint and no other.
     *
     * `getDeviceType()` reads `window.innerWidth`, which includes the scrollbar where a
     * media query does not, so the two can disagree by a few pixels at the boundary. It
     * costs a tile-width of difference on one frame at exactly 780px wide, and the
     * alternative — waiting for JS to tell us the width — is the flash this is here to
     * remove.
     */
    public function mediaQuery(): string
    {
        return match ($this) {
            self::Mobile  => '(max-width: 440px)',
            self::Tablet  => '(min-width: 441px) and (max-width: 780px)',
            self::Desktop => '(min-width: 781px)',
        };
    }

    /**
     * The media condition for this breakpoint inside an image's `sizes` attribute.
     *
     * `sizes` is evaluated left to right and the first match wins, so unlike
     * `mediaQuery()` each condition needs only its upper bound, and Desktop — the last
     * one, the default — needs none. Same numbers as `mediaQuery()`; change them together.
     */
    public function sizesCondition(): string
    {
        return match ($this) {
            self::Mobile  => '(max-width: 440px) ',
            self::Tablet  => '(max-width: 780px) ',
            self::Desktop => '',
        };
    }

    public function distanceTo(self $other): int
    {
        return abs($this->position() - $other->position());
    }

    public function position(): int
    {
        return (int) array_search($this, self::ordered(), true);
    }
}

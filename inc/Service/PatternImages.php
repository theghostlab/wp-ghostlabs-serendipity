<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The demo tiles the patterns are composed from.
 *
 * A pattern cannot ship attachment IDs — they belong to whichever site installs it — so
 * these are referenced by URL and the render resolves them through `imageFromUrl()`.
 *
 * Twelve CC0 photographs, sourced from Wikimedia Commons. Every one of them is named,
 * licensed and linked in `assets/patterns/CREDITS.md` — they are redistributed by every
 * install of both editions, so the provenance travels with them rather than living in
 * somebody's memory.
 *
 * They replaced a set of generated OKLCH gradients in the brand purple. Those were honest
 * about being placeholders and cost 244 KB; these cost 929 KB, on a plugin that was 744 KB
 * in total. The trade was made deliberately: a photo gallery whose own demo is twelve flat
 * gradients undersells itself everywhere it is seen — the listing screenshots, the pattern
 * previews in the inserter, the first gallery a new user builds.
 *
 * ⚠️ **WebP, not JPEG, and the difference is 1.5 MB.** The same twelve crops at matched
 * visual quality are 2.4 MB as JPEG and 929 KB as WebP. Do not re-derive that from PSNR:
 * measured that way JPEG "wins" every one of these images, because PSNR punishes exactly
 * the perceptual filtering WebP spends its bits on. Checked at 100% against the lossless
 * source they are indistinguishable, including on the two tiles where WebP is 80% smaller.
 * AVIF came out level with WebP (954 KB) and needs a newer floor — WordPress 6.5 against
 * 5.8 — so it buys nothing here.
 *
 * The extension is written in one place: the sprintf in `at()`.
 *
 * To ship different work, replace the files in `assets/patterns/` keeping the names, add
 * the rows to `CREDITS.md`, and adjust `SHAPES` and `ALT` below if the aspect ratios or
 * subjects change — nothing else refers to them.
 */
final class PatternImages
{
    private const COUNT = 12;

    private const DIRECTORY = 'assets/patterns';

    /**
     * Intrinsic size of each tile, in file order. Only used to keep a pattern's
     * composition honest about what shape the source is; the mosaic crops to its own
     * rectangles regardless.
     *
     * @var array<int, array{int, int}>
     */
    private const SHAPES = [
        [1200, 800], [800, 1000], [1200, 800], [1000, 1000],
        [1200, 675], [800, 1100], [1200, 800], [1100, 800],
        [900, 1200], [1200, 800], [1200, 675], [1000, 800],
    ];

    /**
     * What each photograph is of, in file order.
     *
     * ⚠️ Not decorative any more. While these were flat gradients an empty `alt` was the
     * correct answer — there was nothing a screen reader could usefully say about one. A
     * photograph is different: a pattern inserted and published before its demo images are
     * swapped would otherwise put twelve unlabeled photographs on a live page.
     *
     * Kept short and literal. These describe stock photographs the user is expected to
     * replace, so the text has to be accurate rather than evocative.
     *
     * @var array<int, string>
     */
    private const ALT = [
        'A stream running through a misty pine forest',
        'Bare trees in a blue-green forest fog',
        'Sunlit ridges of a pale desert',
        'The black center of a red poppy, close up',
        'Green hills meeting a pale turquoise sea',
        'A wide waterfall falling past dark rock',
        'A lake at sunrise, with a church on the shore',
        'The bow of a moored boat, harbor lights behind',
        'A dark building facade with violet windows',
        'Snow-covered pines below a mountain',
        'A river city at night, seen from a bridge',
        'A bee on a lavender flower',
    ];

    /**
     * One image, by position in the set. Wraps around, so a pattern asking for sixteen
     * tiles gets twelve distinct ones and four repeats rather than four broken images.
     *
     * The intrinsic size travels with the tile. Core decides `loading` and
     * `fetchpriority` only for an image whose dimensions it knows, and a pattern's
     * tiles have no attachment it could look them up from — so the pattern says.
     *
     * @return array{id: int, url: string, alt: string, caption: string, width: int, height: int}
     */
    public static function at(int $index, string $caption = ''): array
    {
        $position = $index % self::COUNT;
        [$width, $height] = self::SHAPES[$position];

        return [
            // No attachment. This is the whole reason the renderer grew a URL path.
            'id'  => 0,
            'url' => sprintf(
                '%s/%s/serendipity-%02d.webp',
                rtrim(GHOSTLABS_SERENDIPITY_PLUGIN_URL, '/'),
                self::DIRECTORY,
                $position + 1
            ),
            'alt'     => self::ALT[$position],
            'caption' => $caption,
            'width'   => $width,
            'height'  => $height,
        ];
    }

    /**
     * @param array<string> $captions Optional caption per tile, in order.
     * @return array<array{id: int, url: string, alt: string, caption: string, width: int, height: int}>
     */
    public static function set(int $count, array $captions = []): array
    {
        $images = [];

        for ($i = 0; $i < $count; $i++) {
            $images[] = self::at($i, $captions[$i] ?? '');
        }

        return $images;
    }

    /** @return array{int, int} */
    public static function shape(int $index): array
    {
        return self::SHAPES[$index % self::COUNT];
    }
}

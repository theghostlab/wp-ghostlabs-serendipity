<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Block markup for the patterns.
 *
 * Gallery blocks go through `serialize_block()` so the attribute JSON is escaped the way
 * core escapes it; the surrounding prose blocks are written as markup, which is how a
 * pattern is normally read and edited.
 *
 * Every gallery ships with `id: ''`. The editor assigns one from the block's client ID on
 * insert, which is what keeps two copies of the same pattern from sharing a DOM id — and
 * the server-rendered geometry keys off that id, so a duplicate would style both.
 */
final class PatternBuilder
{
    private const BLOCK = 'ghostlabs/serendipity';

    /**
     * @param array{
     *  count: int,
     *  layouts: array<string, array<array{0: float, 1: array<float>}>>,
     *  captions?: array<string>,
     *  align?: string,
     *  gap?: string,
     *  width?: float,
     *  minHeight?: string,
     *  hoverStyle?: string,
     *  lightbox?: string,
     *  thumbnailSize?: string,
     *  imageResolution?: string,
     *  mobileStackThumbnails?: bool,
     *  showCarouselCaptions?: bool,
     *  controls?: string,
     * } $args
     */
    public static function gallery(array $args): string
    {
        $minHeight = $args['minHeight'] ?? '720px';
        $captions  = $args['captions'] ?? [];
        $lightbox  = $args['lightbox'] ?? 'own';
        $gap       = $args['gap'] ?? '2px';

        $attributes = [
            'id'                    => '',
            'gap'                   => $gap,
            'minHeight'             => $minHeight,
            // Revisited 2026-09-26 and kept. Since the render writes its own `sizes`
            // and the plugin registers a 480-wide size, the browser picks from the
            // srcset and this decides nothing a visitor downloads: it is the `src` a
            // browser with no srcset falls back to, the aspect ratio in width/height,
            // and the editor's preview, and for those `large` is the better answer.
            'thumbnailSize'         => $args['thumbnailSize'] ?? 'large',
            'imageResolution'       => $args['imageResolution'] ?? 'large',
            'rawImages'             => PatternImages::set($args['count'], $captions),
            'hoverStyle'            => $args['hoverStyle'] ?? '',
            'lightbox'              => $lightbox,
            'layoutData'            => PatternLayout::layouts(
                $args['layouts'],
                $minHeight,
                $gap,
                $args['width'] ?? PatternLayout::NOMINAL_WIDTH
            ),
            'mobileStackThumbnails' => $args['mobileStackThumbnails'] ?? false,

            // The legacy boolean, kept in step with the mode it was replaced by. A block
            // that disagreed with itself would be rewritten by the attribute gate.
            'carousel'              => $lightbox === 'builtin',
            'showCarouselCaptions'  => $args['showCarouselCaptions'] ?? false,
            'controls'              => $args['controls'] ?? 'dot-navigation',
            'debug'                 => false,
        ];

        if ( ! empty($args['align'])) {
            $attributes['align'] = $args['align'];
        }

        return serialize_block([
            'blockName'    => self::BLOCK,
            'attrs'        => $attributes,
            'innerBlocks'  => [],
            'innerHTML'    => '',
            'innerContent' => [],
        ]);
    }

    public static function heading(string $text, int $level = 2, string $align = ''): string
    {
        $attrs = $level === 2 ? [] : ['level' => $level];

        if ($align !== '') {
            $attrs['textAlign'] = $align;
        }

        $class = 'wp-block-heading' . ($align !== '' ? ' has-text-align-' . $align : '');

        return sprintf(
            '<!-- wp:heading %s--><h%d class="%s">%s</h%d><!-- /wp:heading -->',
            $attrs === [] ? '' : wp_json_encode($attrs) . ' ',
            $level,
            $class,
            esc_html($text),
            $level
        );
    }

    /**
     * @param array<string, mixed> $attrs
     */
    public static function paragraph(string $text, array $attrs = []): string
    {
        $classes = [];

        if (isset($attrs['align'])) {
            $classes[] = 'has-text-align-' . $attrs['align'];
        }

        if (isset($attrs['fontSize'])) {
            $classes[] = 'has-' . $attrs['fontSize'] . '-font-size';
        }

        return sprintf(
            '<!-- wp:paragraph %s--><p%s>%s</p><!-- /wp:paragraph -->',
            $attrs === [] ? '' : wp_json_encode($attrs) . ' ',
            $classes === [] ? '' : ' class="' . implode(' ', $classes) . '"',
            esc_html($text)
        );
    }

    public static function quote(string $text, string $citation = ''): string
    {
        return '<!-- wp:quote --><blockquote class="wp-block-quote">'
            . '<!-- wp:paragraph --><p>' . esc_html($text) . '</p><!-- /wp:paragraph -->'
            . ($citation === '' ? '' : '<cite>' . esc_html($citation) . '</cite>')
            . '</blockquote><!-- /wp:quote -->';
    }

    public static function spacer(int $height = 32): string
    {
        return sprintf(
            '<!-- wp:spacer {"height":"%dpx"} --><div style="height:%dpx" aria-hidden="true" class="wp-block-spacer"></div><!-- /wp:spacer -->',
            $height,
            $height
        );
    }

    /**
     * @param array<string> $columns Inner markup for each column.
     * @param array<int>    $widths  Percentage width per column, or [] for even.
     */
    public static function columns(array $columns, array $widths = []): string
    {
        $markup = '<!-- wp:columns --><div class="wp-block-columns">';

        foreach ($columns as $index => $inner) {
            $width = $widths[$index] ?? null;

            $markup .= $width === null
                ? '<!-- wp:column --><div class="wp-block-column">'
                : sprintf(
                    '<!-- wp:column {"width":"%d%%"} --><div class="wp-block-column" style="flex-basis:%d%%">',
                    $width,
                    $width
                );

            $markup .= $inner . '</div><!-- /wp:column -->';
        }

        return $markup . '</div><!-- /wp:columns -->';
    }

    /**
     * A cover, using one of the demo tiles as its background.
     *
     * No attachment ID here either — `url` alone is enough for core's cover block, which
     * is the same accommodation the gallery had to make for patterns.
     *
     * ⚠️ This is core's cover `save()` written out by hand, and a cover is valid only if it
     * matches that output exactly: the image before the overlay, and the overlay's class
     * rounded the way `dimRatioToClass()` rounds it — to the nearest ten, with no number
     * at all for the default 50. Anything else is an invalid block in the inserter
     * preview and "Attempt recovery" on insert, with nothing failing but a console line.
     * `editor/patterns.spec.ts` › "every block in every pattern is valid" checks it
     * against the real `save()`.
     */
    public static function cover(int $imageIndex, string $inner, int $minHeight = 480, int $dim = 50): string
    {
        $url = PatternImages::at($imageIndex)['url'];

        $dimClass = $dim === 50 ? '' : ' has-background-dim-' . (10 * (int) round($dim / 10));

        $attrs = wp_json_encode([
            'url'           => $url,
            'dimRatio'      => $dim,
            'minHeight'     => $minHeight,
            'minHeightUnit' => 'px',
            'align'         => 'full',
            'layout'        => ['type' => 'constrained'],
        ]);

        return sprintf(
            '<!-- wp:cover %s --><div class="wp-block-cover alignfull" style="min-height:%dpx">'
            . '<img class="wp-block-cover__image-background" alt="" src="%s" data-object-fit="cover"/>'
            . '<span aria-hidden="true" class="wp-block-cover__background%s has-background-dim"></span>'
            . '<div class="wp-block-cover__inner-container">%s</div></div><!-- /wp:cover -->',
            $attrs,
            $minHeight,
            esc_url($url),
            $dimClass,
            $inner
        );
    }

    /**
     * A group, so a pattern's prose and its mosaic move together and can be given one
     * background by the theme.
     */
    public static function group(string $inner, string $align = ''): string
    {
        $attrs = $align === '' ? '' : wp_json_encode(['align' => $align]) . ' ';
        $class = 'wp-block-group' . ($align === '' ? '' : ' align' . $align);

        return sprintf(
            '<!-- wp:group %s--><div class="%s">%s</div><!-- /wp:group -->',
            $attrs,
            $class,
            $inner
        );
    }
}

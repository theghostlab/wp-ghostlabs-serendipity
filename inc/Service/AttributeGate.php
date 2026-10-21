<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Enum\Lightbox;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Normalizes a gallery block's attributes before anything reads them.
 *
 * The second of the three gates. The editor will not offer a licensed value to a build
 * that cannot use it, and the render service resolves the capability again before it
 * emits anything — but between those two sits everything else that reads parsed block
 * data: other plugins filtering `render_block`, the REST rendered-content endpoint, a
 * theme walking `parse_blocks()`. This makes sure they all see the same attributes the
 * render will act on.
 *
 * Registered on `render_block_data`, which runs after the block is parsed and before it
 * renders, and is the only hook that lets an attribute be corrected rather than the
 * output patched afterwards.
 *
 * It rewrites rather than rejects. A gallery whose license has lapsed should keep
 * rendering with a plain anchor, not disappear or throw — the image stays reachable and
 * any third-party lightbox still works.
 */
final class AttributeGate
{
    private const BLOCK = 'ghostlabs/serendipity';

    /**
     * @param array<string, mixed> $parsed
     * @return array<string, mixed>
     */
    public function normalize(mixed $parsed): mixed
    {
        if ( ! is_array($parsed) || ($parsed['blockName'] ?? null) !== self::BLOCK) {
            return $parsed;
        }

        $attrs = is_array($parsed['attrs'] ?? null) ? $parsed['attrs'] : [];

        $requested = Lightbox::fromLegacyCarousel(
            isset($attrs['lightbox']) && is_string($attrs['lightbox']) ? $attrs['lightbox'] : null,
            (bool) ($attrs['carousel'] ?? false)
        );

        $granted = $requested->isLicensed() && ! Capabilities::has(Capabilities::BUILT_IN_LIGHTBOX)
            ? Lightbox::DEFAULT
            : $requested;

        $attrs['lightbox'] = $granted->value;

        // Keep the legacy boolean consistent with the resolved mode. Leaving a stale
        // `true` behind would have the carousel payload emitted for a gallery that is
        // no longer allowed one.
        $attrs['carousel'] = $granted === Lightbox::BuiltIn;

        // The other two gated features. Both are only ever *set* by a licensed editor,
        // so what is being caught here is a block that arrived some other way: pasted
        // from a licensed site, restored from a backup, or left behind by a license that
        // has since lapsed.
        $attrs = $this->normalizeHoverStyle($attrs);
        $attrs = $this->normalizeReframing($attrs);

        $parsed['attrs'] = $attrs;

        return $parsed;
    }

    /**
     * @param array<string, mixed> $attrs
     * @return array<string, mixed>
     */
    private function normalizeHoverStyle(array $attrs): array
    {
        $style = $attrs['hoverStyle'] ?? null;

        if (
            is_string($style)
            && in_array($style, Capabilities::LICENSED_HOVER_STYLES, true)
            && ! Capabilities::has(Capabilities::HOVER_STYLES_EXTENDED)
        ) {
            $attrs['hoverStyle'] = Capabilities::FREE_HOVER_STYLE;
        }

        return $attrs;
    }

    /**
     * Strip the crops a licensed editor wrote into the saved layout.
     *
     * Pan & tilt leaves no attribute of its own — it rides in `layoutData` as an
     * `objectPosition` on each rectangle — so a gallery copied from a licensed site
     * carries its reframing with it and would otherwise keep it.
     *
     * @param array<string, mixed> $attrs
     * @return array<string, mixed>
     */
    private function normalizeReframing(array $attrs): array
    {
        if (
            Capabilities::has(Capabilities::PAN_TILT)
            || ! is_array($attrs['layoutData'] ?? null)
        ) {
            return $attrs;
        }

        $attrs['layoutData'] = array_map(
            static function (mixed $layout): mixed {
                if ( ! is_array($layout) || ! is_array($layout['rectangles'] ?? null)) {
                    return $layout;
                }

                $layout['rectangles'] = array_map(
                    static fn (mixed $rect): mixed => is_array($rect)
                        ? array_diff_key($rect, [ 'objectPosition' => null ])
                        : $rect,
                    $layout['rectangles']
                );

                return $layout;
            },
            $attrs['layoutData']
        );

        return $attrs;
    }
}

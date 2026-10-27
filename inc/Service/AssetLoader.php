<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Config\PluginConfig;
use WP_Block_Patterns_Registry;
use WP_Post;
use WP_Query;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The gallery's front-end assets: registered always, loaded only where there is a gallery.
 *
 * These used to be enqueued unconditionally on every front-end request — 48.5 KB of JS and
 * 12.9 KB of CSS on a contact page, plus a `wp-data` dependency the bundle never used, which
 * dragged wp-element and React onto pages that had no blocks on them at all.
 *
 * Loading them conditionally is two decisions, not one:
 *
 * 1. **Sniff before wp_head, and enqueue in the head when we can.** The stylesheet is what
 *    hides the raw images behind `--gallery-loading` on the first render-blocking paint, so a
 *    stylesheet that arrives in the footer would *cause* the flash the class exists to prevent.
 *    Everything below the sniff is therefore about finding the block early — including where it
 *    is hidden behind a reference (a synced pattern, a template part, a block widget).
 * 2. **Enqueue again at render, as a net.** No sniff catches everything: a plugin can render a
 *    block from a shortcode, a page builder, or its own query. `Serendipity::render()` asks for
 *    the assets too. That call is idempotent when the sniff already found the gallery, and when
 *    it did not, WordPress prints the assets late — which is a flash on an unusual page rather
 *    than a gallery with no styles at all.
 */
final class AssetLoader
{
    /** Style and script share a handle; both are `ghostlabs-serendipity`. */
    public const HANDLE = 'ghostlabs-serendipity';

    /**
     * The galleries' first-paint geometry: a stylesheet with no file, which only ever carries
     * what `addLayoutCss()` adds to it, printed after the gallery's own.
     */
    public const LAYOUT_HANDLE = 'ghostlabs-serendipity-layout';

    private const BLOCK = 'ghostlabs/serendipity';

    /**
     * How far to follow a reference before giving up. A synced pattern inside a template
     * part inside a template is three, and beyond that the cost of looking stops being
     * worth the odds of finding.
     */
    private const MAX_DEPTH = 3;

    private ?bool $needed = null;

    /** @var list<string> Style handles an edition loads wherever the gallery's own loads. */
    private static array $alongside = [];

    /**
     * Load an edition's stylesheet with the gallery's, after it: in the head when the sniff
     * finds a gallery, and at render when it did not. Registered by the edition, with the
     * gallery's handle as its dependency.
     */
    public static function alongside(string $styleHandle): void
    {
        if ( ! in_array($styleHandle, self::$alongside, true)) {
            self::$alongside[] = $styleHandle;
        }
    }

    /** Test seam: forget every stylesheet an edition added. */
    public static function reset(): void
    {
        self::$alongside = [];
    }

    /**
     * The plugin's URL without its trailing slash.
     *
     * Every entry file defines the constant with `plugin_dir_url()`, which keeps the
     * slash, so building a path onto it with another one produces `…/plugin//assets/…`.
     * Browsers forgive it; a CDN, a cache key or a subresource-integrity map may not.
     */
    private static function url(string $relativePath): string
    {
        return rtrim(GHOSTLABS_SERENDIPITY_PLUGIN_URL, '/') . '/' . ltrim($relativePath, '/');
    }

    /**
     * Register the assets and, when this page has a gallery on it, enqueue them.
     *
     * Runs on `wp_enqueue_scripts`, which fires inside `wp_head` — before a classic theme's
     * loop renders the content, so anything found here lands in the head.
     */
    public function register(): void
    {
        self::registerAssets();

        if ($this->pageUsesGallery()) {
            self::enqueue();
        }
    }

    /**
     * Register every handle that is not registered yet.
     *
     * ⚠️ Not only from `wp_enqueue_scripts`. A block theme renders the page's content before
     * `wp_head`, so a gallery renders before that hook has run — and `wp_add_inline_script()` /
     * `wp_add_inline_style()` on a handle that is not registered yet drop what they were given
     * without a word. `addGalleryData()` and `addLayoutCss()` register first for that reason.
     */
    public static function registerAssets(): void
    {
        $version = PluginConfig::$version;


        if ( ! wp_style_is(self::HANDLE, 'registered')) {
            wp_register_style(
                self::HANDLE,
                self::url('assets/css/ghostlabs-serendipity.css'),
                [],
                $version
            );
        }

        // No `wp-data`. The bundle imports nothing from @wordpress/data and never calls
        // select() or subscribe(); the dependency was inherited from the editor build. In
        // core, wp-data depends on wp-element, which depends on react and react-dom, so
        // declaring it pulled the whole React runtime onto every page of the site.
        if ( ! wp_script_is(self::HANDLE, 'registered')) {
            wp_register_script(
                self::HANDLE,
                self::url('assets/js/ghostlabs-serendipity-bundle.js'),
                [],
                $version,
                true
            );
        }

        // No file: it carries only the inline geometry, after the stylesheet whose loading
        // state that geometry cancels.
        if ( ! wp_style_is(self::LAYOUT_HANDLE, 'registered')) {
            wp_register_style(self::LAYOUT_HANDLE, false, [self::HANDLE], $version);
        }
    }

    /**
     * Hand the gallery bundle a gallery's data: inline, before the bundle, which reads it when
     * it runs. Printed only where the bundle is, with it in the footer.
     *
     * WordPress.org's review (2026-10-27): no script element of the plugin's own.
     */
    public static function addGalleryData(string $script): void
    {
        self::registerAssets();

        wp_add_inline_script(self::HANDLE, $script, 'before');
    }

    /**
     * Add a gallery's first-paint geometry to the layout stylesheet, and ask for it.
     *
     * Core prints it in the head where the content renders before `wp_head` (a block theme),
     * and with the late styles where it renders after (a classic theme) — the way it prints
     * its own block-support CSS. On a classic theme the tiles wait behind the loading state
     * until then, which is what that state is for.
     *
     * WordPress.org's review (2026-10-27): no style element of the plugin's own.
     */
    public static function addLayoutCss(string $css): void
    {
        self::registerAssets();

        wp_add_inline_style(self::LAYOUT_HANDLE, $css);
        wp_enqueue_style(self::LAYOUT_HANDLE);
    }

    /**
     * Ask for the gallery assets by handle.
     *
     * Static and side-effect-free beyond the queue, so the render service can call it
     * without holding a reference to anything. Enqueuing a handle twice is a no-op, and
     * enqueuing one that was never registered is also a no-op — which is what makes it
     * safe to call from shared code in a build that might not have registered it yet.
     */
    public static function enqueue(): void
    {
        wp_enqueue_style(self::HANDLE);
        wp_enqueue_script(self::HANDLE);

        foreach (self::$alongside as $handle) {
            wp_enqueue_style($handle);
        }
    }

    /**
     * Does anything on this request render a gallery?
     *
     * Ordered cheapest first and short-circuits on the first hit, so the common case — a
     * page with no gallery and no synced patterns — costs one `has_block()` per queried
     * post and nothing else.
     */
    public function pageUsesGallery(): bool
    {
        if ($this->needed !== null) {
            return $this->needed;
        }

        /**
         * Decide for us. `null` leaves the sniff to run.
         *
         * The escape hatch for the pages this cannot see: a theme that renders a gallery
         * from a custom field, a page builder, a shortcode. Returning true from here is
         * how such a site gets the assets in the head rather than the footer.
         *
         * @param bool|null $load
         */
        $override = apply_filters('ghostlabs_serendipity_load_assets', null);

        if (is_bool($override)) {
            return $this->needed = $override;
        }

        return $this->needed = $this->queryHasGallery()
            || $this->templateHasGallery()
            || $this->widgetsHaveGallery();
    }

    /**
     * The posts this request is about.
     *
     * Archives are included: a theme is free to run `the_content` in its loop, and a
     * gallery in the second post of an archive is as real as one on a single page.
     */
    private function queryHasGallery(): bool
    {
        $query = $GLOBALS['wp_query'] ?? null;

        if ( ! $query instanceof WP_Query) {
            return false;
        }

        foreach ($query->posts as $post) {
            if ($post instanceof WP_Post && $this->contentHasGallery($post->post_content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * A block theme's resolved template.
     *
     * `locate_block_template()` stores it on `template_include`, which is well before
     * `wp_head`, so by the time this runs the template is known — template parts still
     * unresolved, which `references()` handles.
     */
    private function templateHasGallery(): bool
    {
        $template = $GLOBALS['_wp_current_template_content'] ?? null;

        return is_string($template) && $this->contentHasGallery($template);
    }

    /**
     * Block widgets, which render in a sidebar long after `wp_head` has closed.
     *
     * ⚠️ Only widgets placed in a sidebar. `widget_block` holds every block widget ever made,
     * including ones parked in Inactive Widgets or orphaned by a theme switch; those render
     * nowhere, and reading them put the assets on every page of the site.
     *
     * Asked of core's `is_active_widget()`, which skips both of those when `$skip_inactive` is
     * true and honors the `sidebars_widgets` filter, so a widget another plugin hides is not
     * counted. ⚠️ It reads `$wp_registered_widgets[ $id ]['id']` without checking it exists, so
     * a widget left in the option but never registered is passed over first: it cannot render.
     */
    private function widgetsHaveGallery(): bool
    {
        $widgets = get_option('widget_block');

        if ( ! is_array($widgets)) {
            return false;
        }

        $registered = $GLOBALS['wp_registered_widgets'] ?? [];

        foreach ($widgets as $number => $widget) {
            $id = 'block-' . $number;

            if ( ! is_int($number) || ! isset($registered[ $id ]) || ! is_active_widget(false, $id, 'block', true)) {
                continue;
            }

            $content = is_array($widget) ? ($widget['content'] ?? null) : null;

            if (is_string($content) && $this->contentHasGallery($content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Is the block in this content, or in anything this content points at?
     */
    private function contentHasGallery(string $content, int $depth = 0): bool
    {
        if ($content === '' || $depth > self::MAX_DEPTH) {
            return false;
        }

        if (has_block(self::BLOCK, $content)) {
            return true;
        }

        foreach ($this->references($content) as $referenced) {
            if ($this->contentHasGallery($referenced, $depth + 1)) {
                return true;
            }
        }

        return false;
    }

    /**
     * The content behind every reference in this content.
     *
     * A synced pattern, an unsynced pattern and a template part all serialize as a block
     * with a pointer and no inner content, so `has_block()` on the parent says nothing
     * about what they contain. This is the reason the plan preferred a render-time
     * enqueue to `has_block()` in the first place; resolving them is what buys the head
     * placement back.
     *
     * @return array<string>
     */
    private function references(string $content): array
    {
        $out = [];

        foreach ($this->blocksNamed($content, 'core/block') as $block) {
            $ref = isset($block['attrs']['ref']) ? (int) $block['attrs']['ref'] : 0;
            $post = $ref > 0 ? get_post($ref) : null;

            if ($post instanceof WP_Post) {
                $out[] = $post->post_content;
            }
        }

        foreach ($this->blocksNamed($content, 'core/pattern') as $block) {
            $slug = isset($block['attrs']['slug']) ? (string) $block['attrs']['slug'] : '';
            $pattern = $slug !== '' && class_exists(WP_Block_Patterns_Registry::class)
                ? WP_Block_Patterns_Registry::get_instance()->get_registered($slug)
                : null;

            if (is_array($pattern) && isset($pattern['content']) && is_string($pattern['content'])) {
                $out[] = $pattern['content'];
            }
        }

        foreach ($this->blocksNamed($content, 'core/template-part') as $block) {
            $slug = isset($block['attrs']['slug']) ? (string) $block['attrs']['slug'] : '';

            if ($slug === '' || ! function_exists('get_block_template')) {
                continue;
            }

            $theme = isset($block['attrs']['theme']) ? (string) $block['attrs']['theme'] : get_stylesheet();
            $part = get_block_template($theme . '//' . $slug, 'wp_template_part');

            if ($part !== null) {
                $out[] = $part->content;
            }
        }

        return $out;
    }

    /**
     * Every block of one name in this content, however deeply nested.
     *
     * Parsing is the expensive part, so it only happens once the cheap `has_block()` says
     * the container is there at all.
     *
     * @return array<array{blockName: string|null, attrs: array<string, mixed>, innerBlocks: array<mixed>}>
     */
    private function blocksNamed(string $content, string $name): array
    {
        if ( ! has_block($name, $content)) {
            return [];
        }

        return $this->collect(parse_blocks($content), $name);
    }

    /**
     * @param array<mixed> $blocks
     * @return array<array{blockName: string|null, attrs: array<string, mixed>, innerBlocks: array<mixed>}>
     */
    private function collect(array $blocks, string $name): array
    {
        $found = [];

        foreach ($blocks as $block) {
            if ( ! is_array($block)) {
                continue;
            }

            /** @var array{blockName?: string|null, attrs?: array<string, mixed>, innerBlocks?: array<mixed>} $block */
            if (($block['blockName'] ?? null) === $name) {
                $found[] = [
                    'blockName'   => $name,
                    'attrs'       => $block['attrs'] ?? [],
                    'innerBlocks' => $block['innerBlocks'] ?? [],
                ];
            }

            if ( ! empty($block['innerBlocks'])) {
                $found = array_merge($found, $this->collect($block['innerBlocks'], $name));
            }
        }

        return $found;
    }
}

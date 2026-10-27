<?php

namespace GHOSTLABS\SERENDIPITY;

use Exception;
use GHOSTLABS\SERENDIPITY\Boot\TierBootFactory;
use GHOSTLABS\SERENDIPITY\Contracts\TierBootInterface;
use GHOSTLABS\SERENDIPITY\Service\AssetLoader;
use GHOSTLABS\SERENDIPITY\Patterns\FreePatterns;
use GHOSTLABS\SERENDIPITY\Service\TilePriority;
use GHOSTLABS\SERENDIPITY\Service\TileSize;
use GHOSTLABS\SERENDIPITY\Service\BlockFactory;
use GHOSTLABS\SERENDIPITY\Service\Loader;
use GHOSTLABS\SERENDIPITY\Service\PatternLibrary;
use GHOSTLABS\SERENDIPITY\Service\PluginRowMeta;
use GHOSTLABS\SERENDIPITY\Traits\Singleton;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Wires everything every edition has, and delegates the rest.
 *
 * This class ships in every build, so it names no edition and constructs nothing an
 * edition might not carry. What it wires — the block and the gallery's front-end
 * assets — is the product. What varies sits behind one object, resolved by
 * TierBootFactory from the edition the entry header declared.
 */
final class Kernel
{
    use Singleton;

    private BlockFactory $blockFactory;
    private Loader $loader;
    private AssetLoader $assets;
    private PatternLibrary $patterns;

    /**
     * The edition's own wiring. Everything edition-specific is behind this, so nothing
     * below has to know which build it is running in.
     */
    private TierBootInterface $tier;

    public function init() : Kernel
    {
        $this->blockFactory = new BlockFactory();
        $this->loader       = new Loader();
        $this->assets       = new AssetLoader();
        $this->patterns     = new PatternLibrary();
        $this->tier         = TierBootFactory::current();

        // The starter set every edition ships. An edition with more of them adds its own
        // provider from its boot class, so this never has to know which build it is in.
        PatternLibrary::provide(new FreePatterns());

        $this
            ->defineTilePriority()
            ->defineFrontendAssets()
            ->defineTileSize()
            ->definePatterns()
            ->definePluginRowMeta()
        ;

        // Last, so the edition's hooks land after the common ones — the order the
        // Kernel registered them in when this wiring still lived here.
        $this->tier->boot($this->loader);

        return $this;
    }

    /**
     * Inside post content core decides `loading` after the render, tag by tag; this is
     * where a lazy tile is also marked low priority. See TilePriority.
     */
    private function defineTilePriority(): static
    {
        $this->loader->add_filter('wp_content_img_tag', new TilePriority(), 'lower', 10, 3);

        return $this;
    }

    /**
     * The Plugins row's other column. Two arguments: the hook is global, and the plugin file it
     * passes is what PluginRowMeta compares before anything is added.
     */
    private function definePluginRowMeta(): static
    {
        $this->loader->add_filter('plugin_row_meta', new PluginRowMeta(), 'rowMeta', 10, 2);

        return $this;
    }

    /**
     * The intermediate image size the tiles were missing — see TileSize for why, and
     * for the filter a site uses to decline it.
     */
    private function defineTileSize(): static
    {
        $this->loader->add_action('init', new TileSize(), 'register');

        return $this;
    }

    /**
     * Register the gallery's front-end assets, and load them where there is a gallery.
     *
     * The Kernel used to enqueue both unconditionally at this priority. See AssetLoader
     * for why the decision moved and why it still has to be made this early.
     */
    private function defineFrontendAssets(): static
    {
        /** @uses AssetLoader::register */
        $this->loader->add_action('wp_enqueue_scripts', $this->assets, 'register', 100);

        return $this;
    }

    /**
     * Register the block patterns.
     *
     * On `init` at 20, after registerBlocks() adds its callbacks at the default priority:
     * a pattern whose block is not registered yet previews as an invalid-block warning
     * in the inserter, which is the first thing a new user sees of the plugin.
     */
    private function definePatterns(): static
    {
        /** @uses PatternLibrary::register */
        $this->loader->add_action('init', $this->patterns, 'register', 20);

        return $this;
    }

    /**
     * Register the block. Unconditionally.
     *
     * This used to return early unless a license check passed, which meant a build with
     * no license registered no blocks at all — there was nothing for a free edition to
     * be. The block is the product and every edition ships it. What an edition adds to it
     * arrives through that edition's boot (`Service\GalleryExtensions`), rather than by
     * whether the block exists.
     *
     * @throws Exception
     */
    private function registerBlocks(): static
    {
        $blocks = $this->blockFactory->setRegisterBlocks();

        if(empty($blocks)) {
            throw new Exception('No blocks found');
        }

        foreach ($blocks as $block) {
            add_action('init', $block);
        }

        return $this;
    }

    /**
     * @throws Exception
     */
    public function run() : void
    {
        $this->registerBlocks();
        $this->loader->run();
    }
}

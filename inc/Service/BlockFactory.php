<?php

namespace GHOSTLABS\SERENDIPITY\Service;

if ( ! defined( 'ABSPATH' ) ) exit;

class BlockFactory
{
    /**
     * Where the built blocks are. A method rather than a property default, because PHP
     * evaluates every property default the first time the class is touched — static access
     * included — and the constant only exists once an entry header has run.
     */
    private function blocksDir(): string
    {
        return GHOSTLABS_SERENDIPITY_PLUGIN_PATH . 'build/blocks';
    }

    /**
     * @var array|string[]
     */
    private array $dirBlackList = ['..', '.', '.DS_Store'];

    /**
     * @return array<callable>
     */
    public function setRegisterBlocks(): array
    {
        if( !is_dir($this->blocksDir()) ) return [];

        $blocks = array_values( array_diff( scandir($this->blocksDir()), $this->dirBlackList ) );
        
        if( empty($blocks) ) return [];

        $new_functions = [];

        foreach ($blocks as $block)
        {
            $new_functions[] = function () use ($block) {
                $blockType = $this->blocksDir().'/'.$block;
                $registered = register_block_type( $blockType );

                $this->publishCapabilities($registered);
            };
        }

        return $new_functions;
    }

    /**
     * Tell the editor which gated features this build may use.
     *
     * The first of the three gates. The editor disables what the build cannot do and
     * says why, rather than offering a control that silently fails on save — but it is
     * only ever a courtesy, because anything the editor allows is checked again when the
     * attributes are validated and again when the block renders.
     *
     * Attached to the editor script rather than printed globally, so it exists only on
     * screens that actually load the block.
     *
     * @param \WP_Block_Type|false $registered
     */
    private function publishCapabilities(mixed $registered): void
    {
        if ( ! $registered instanceof \WP_Block_Type) {
            return;
        }

        $handle = $registered->editor_script_handles[0] ?? null;

        if ($handle === null) {
            return;
        }

        wp_add_inline_script($handle, self::editorData(), 'before');
    }

    /**
     * The upgrade URLs an edition offers the editor's upsell surfaces, keyed by `from` value.
     *
     * @var array<string, string>
     */
    private static array $upgradeUrls = [];

    /**
     * Offer the editor's upgrade links. The free edition's boot calls this once; an edition
     * with nothing to sell never does, and the defaults are already right.
     *
     * 🔴 **Deliberately not a filter**, for the reason `Capabilities` has none: a filter can be
     * answered by any plugin on the site, and on a licensed site that would switch the free
     * edition's pitch on for a paying customer (claims check, 2026-10-11).
     *
     * Only string keys mapped to non-empty strings are kept.
     *
     * @param array<mixed> $urls
     */
    public static function offerUpgrade(array $urls): void
    {
        self::$upgradeUrls = array_filter(
            $urls,
            static fn ($url, $surface): bool => is_string($surface) && is_string($url) && $url !== '',
            ARRAY_FILTER_USE_BOTH
        );
    }

    /** @return array<string, string> */
    public static function upgradeUrls(): array
    {
        return self::$upgradeUrls;
    }

    /** Forget the offer. Test seam only, like `Capabilities::reset()`. */
    public static function reset(): void
    {
        self::$upgradeUrls = [];
    }

    /**
     * The script the block's editor bundle reads before it runs.
     *
     * Always the capability map. And, only where an edition has offered them
     * (`offerUpgrade()`), the upgrade links the editor's upsell surfaces render — one finished
     * URL per surface, keyed by its `from` value, built by PHP.
     *
     * 🔴 The block is built once and ships to every edition, so it cannot carry a URL of its
     * own: a literal there drops attribution and points every edition at a sale. An edition
     * with nothing to sell offers nothing, publishes no map, and the block renders no link.
     */
    public static function editorData(): string
    {
        $script = sprintf(
            'window.ghostlabsSerendipityCapabilities = %s;',
            wp_json_encode(Capabilities::all())
        );

        if (self::$upgradeUrls !== []) {
            $script .= sprintf('window.ghostlabsSerendipityUpgrade = %s;', wp_json_encode([ 'urls' => self::$upgradeUrls ]));
        }

        return $script;
    }
}

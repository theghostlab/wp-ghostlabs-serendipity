<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Config\PluginConfig;
use GHOSTLABS\SERENDIPITY\Enum\UpsellSource;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Every upgrade link this edition renders, in one place.
 *
 * **PHP assembles the whole URL; nothing else ever composes one.** The editor never appends a
 * parameter and no template writes a host. A URL built in two halves loses whichever half the
 * caller forgot, and that fails invisibly: the link still renders, resolves and looks right.
 *
 * ## ⚠️ The base is a dev literal, whole and greppable
 *
 * `https://theghostlab.io` is rewritten at release by `build.sh --marketing-base=https://…`,
 * which is a **textual** transform, and `assert_no_dev_marketing_base()` refuses a build that
 * still carries it. So the base stays one uninterrupted literal: composing it from a scheme
 * and a host is the helper the rewrite would miss.
 *
 * ⚠️ Do not "fix" it to the production origin. That looks correct and is worse: the rewrite
 * would never match it, every development build would point at production, and the release
 * assertion could not see the problem because no dev literal would be left to find.
 *
 * ⚠️ A **separate rewrite axis** from the backend host. The marketing site and the license
 * backend are different origins on different cadences; this edition links to the backend once,
 * for the buyer's account (`AccountEndpoints`, `--release-host`).
 *
 * 🔴 **No checkout-return contract.** Until 2026-10-08 a buy link could carry `upgrade_return`
 * and `domain`. With them, the license manager mints a claim and its receipt page redirects the
 * buyer straight back to wp-admin for the in-place upgrade to redeem. WordPress.org refused that
 * upgrade, so nothing in this edition reads a claim now, and the redirect would only take the
 * buyer away from the one page that shows their key and the download. `UpgradeEndpointsTest`
 * pins the absence.
 */
final class UpgradeEndpoints
{
    /** The marketing site's origin. See the class docblock before touching it. */
    private const MARKETING_BASE = 'https://theghostlab.io';

    /**
     * This plugin's page on the marketing site — the point of sale. Both Plugin URIs name it too
     * (owner, 2026-10-12; register § Listing).
     */
    private const MARKETING_PATH = '/serendipity';

    /**
     * The plugin's documentation, on the same origin, so one rewrite retargets both.
     *
     * ⚠️ This page must exist on the marketing site before the first release: a 404 behind a
     * link on the settings screen is worse than no link.
     */
    private const DOCS_PATH = '/docs/serendipity';

    /**
     * The upgrade link for one surface: the product page, and which surface asked.
     *
     *     <base>/serendipity?from=<surface>
     *
     * ⚠️ The source is required, not optional. An optional parameter is one a call site can
     * forget, producing a real URL filed in a bucket nobody reads.
     */
    public static function upgradeUrl(UpsellSource $source): string
    {
        // Not passed through rawurlencode: `UpsellSourceTest` asserts the values URL-safe, so
        // what ships in the markup is the same string a human reads in a report.
        return self::MARKETING_BASE . self::MARKETING_PATH . '?from=' . $source->value;
    }

    public static function docsUrl(): string
    {
        return self::MARKETING_BASE . self::DOCS_PATH;
    }

    /**
     * The plugin's WordPress.org support forum: where a free plugin's support belongs.
     *
     * Addressed by the text domain, which .org requires to equal the slug, so the two move
     * together if .org assigns a different one. `FreeRowMetaTest` closes the loop against
     * `build.sh`'s free slug. ⚠️ The forum exists only once .org has approved the plugin.
     */
    public static function supportUrl(): string
    {
        return 'https://wordpress.org/support/plugin/' . PluginConfig::domain() . '/';
    }

    /**
     * One URL per editor surface, keyed by its `from` value — the map the block reads.
     *
     * @return array<string, string>
     */
    public static function editorUrls(): array
    {
        $urls = [];

        foreach (UpsellSource::editor() as $source) {
            $urls[$source->value] = self::upgradeUrl($source);
        }

        return $urls;
    }
}

<?php

declare(strict_types=1);

namespace GHOSTLABS\SERENDIPITY\Service;

use GHOSTLABS\SERENDIPITY\Contracts\PatternProviderInterface;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Registers the plugin's block patterns, and the category they live in.
 *
 * Every edition registers its own set through a provider (see PatternProviderInterface),
 * so this class never names one. A provider that asks for a capability the build has not
 * been granted is skipped entirely rather than registered and degraded.
 */
final class PatternLibrary
{
    public const CATEGORY = 'ghostlabs-serendipity';

    private const NAMESPACE = 'ghostlabs-serendipity';

    /** @var array<PatternProviderInterface> */
    private static array $providers = [];

    /**
     * Contribute a set of patterns. Called before `init` — the Kernel adds the shared
     * set, the edition adds its own.
     */
    public static function provide(PatternProviderInterface ...$providers): void
    {
        foreach ($providers as $provider) {
            self::$providers[$provider::class] = $provider;
        }
    }

    /** Test seam: forget every provider. */
    public static function reset(): void
    {
        self::$providers = [];
    }

    /** @return array<PatternProviderInterface> */
    public static function providers(): array
    {
        return array_values(self::$providers);
    }

    /**
     * Runs on `init`, after the block is registered — a pattern whose block does not
     * exist yet renders as an invalid-block warning in the inserter preview.
     */
    public function register(): void
    {
        if ( ! function_exists('register_block_pattern')) {
            return;
        }

        register_block_pattern_category(self::CATEGORY, [
            'label' => __('Serendipity', 'ghostlabs-serendipity'),
        ]);

        foreach ($this->registrable() as $name => $properties) {
            register_block_pattern(self::NAMESPACE . '/' . $name, $properties);
        }
    }

    /**
     * Every pattern this build is entitled to, keyed by name.
     *
     * @return array<string, array<string, mixed>>
     */
    public function registrable(): array
    {
        $patterns = [];

        foreach (self::$providers as $provider) {
            $capability = $provider->capability();

            // Settled, never asked: this runs on `init` for every request (see
            // Capabilities::hasSettled).
            if ($capability !== null && ! Capabilities::hasSettled($capability)) {
                continue;
            }

            foreach ($provider->patterns() as $name => $properties) {
                $patterns[$name] = $properties + [
                    'categories' => [self::CATEGORY],
                    'source'     => 'plugin',
                ];
            }
        }

        return $patterns;
    }
}

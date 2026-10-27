<?php
/**
 * Serendipity — Bootstrap
 *
 * Loaded by every tier's generated plugin header after the constants are defined.
 * Lives in shared/ so the build copies it to the assembled plugin root.
 *
 * @package GhostLabsSerendipity
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the version-gated GhostLabs package autoloaders.
 *
 * Several GhostLabs plugins bundle their own copy of each package; every copy
 * registers itself, and on plugins_loaded:0 only the newest initializes. Both
 * declare an empty Composer `autoload` block on purpose, so these files — not
 * Composer — are what serve their namespaces. They must therefore run before the
 * Composer autoloader below.
 *
 * This file ships in every edition, so it names no edition and no package beyond the
 * one every other depends on. It registers whatever GhostLabs packages this build's
 * vendor tree holds — each loader is `vendor/ghostlabs/<name>/<name>.php` — which is
 * decided by the edition's manifest. The free edition's manifest requires none:
 * shared/ carries its own DTO mapper, so the base edition can be published as source
 * anyone can check out and install.
 *
 * `wp-kit` first: it documents the dependency direction, and it is the order every other
 * package's own "is kit present?" diagnostic assumes.
 */
$ghostlabs_serendipity_packages = glob( __DIR__ . '/vendor/ghostlabs/*', GLOB_ONLYDIR ) ?: [];

usort(
	$ghostlabs_serendipity_packages,
	static fn ( string $a, string $b ): int => [ basename( $a ) !== 'wp-kit', $a ] <=> [ basename( $b ) !== 'wp-kit', $b ]
);

foreach ( $ghostlabs_serendipity_packages as $ghostlabs_serendipity_package ) {
	$ghostlabs_serendipity_loader = $ghostlabs_serendipity_package . '/' . basename( $ghostlabs_serendipity_package ) . '.php';

	if ( file_exists( $ghostlabs_serendipity_loader ) ) {
		require_once $ghostlabs_serendipity_loader;
	}
}

unset( $ghostlabs_serendipity_packages, $ghostlabs_serendipity_package, $ghostlabs_serendipity_loader );

// Load Composer autoloader (plugin's GHOSTLABS\SERENDIPITY classes load via PSR-4 from here).
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
} else {
	add_action( 'admin_notices', function () {
		echo '<div class="error"><p>Serendipity plugin error: Composer autoloader not found. Please run <code>composer install</code>.</p></div>';
	} );
	return;
}

// No text domain is loaded here. Core loads a plugin's language pack on its own, the first
// time a string in its domain is asked for; an edition with no pack to deliver loads its own
// translations from its boot class.

// Boot the plugin.
use GHOSTLABS\SERENDIPITY\Kernel;

add_action( 'plugins_loaded', function () {
	try {
		Kernel::getInstance()->init()->run();
	} catch ( \Exception $e ) {
		// WordPress's debug channel: silent unless WP_DEBUG is on, then wherever the site sends
		// PHP's own errors. Core runs the message through kses first.
		wp_trigger_error( 'Serendipity', $e->getMessage(), E_USER_WARNING );
	}
}, 10 );

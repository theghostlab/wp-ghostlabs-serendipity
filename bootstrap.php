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
 * This file ships in every edition, so it names no edition. It asks only what is
 * present in this build's vendor tree:
 *
 *   wp-kit      The options and REST contracts. Present only in editions whose
 *               manifest requires it — shared/ carries its own DTO mapper, so an
 *               edition can be built from this directory alone with no GhostLabs
 *               package at all. That is what lets the base edition be published as
 *               source anyone can check out and install.
 *   wp-license  Present only in builds whose manifest requires it.
 *
 * Kit first: it documents the dependency direction, and it is the order the second
 * package's own "is kit present?" diagnostic assumes.
 *
 * The file_exists guard is the whole mechanism. Which packages a build carries is
 * decided by its manifest, and this loop simply registers whatever it finds — so
 * an edition that omits one needs no branch here, and no knowledge of it.
 */
foreach ( [ 'wp-kit/wp-kit.php', 'wp-license/wp-license.php' ] as $ghostlabs_serendipity_package ) {
	$ghostlabs_serendipity_loader = __DIR__ . '/vendor/ghostlabs/' . $ghostlabs_serendipity_package;

	if ( file_exists( $ghostlabs_serendipity_loader ) ) {
		require_once $ghostlabs_serendipity_loader;
	}
}

unset( $ghostlabs_serendipity_package, $ghostlabs_serendipity_loader );

// Load Composer autoloader (plugin's GHOSTLABS\SERENDIPITY classes load via PSR-4 from here).
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
} else {
	add_action( 'admin_notices', function () {
		echo '<div class="error"><p>Serendipity plugin error: Composer autoloader not found. Please run <code>composer install</code>.</p></div>';
	} );
	return;
}

// Load text domain.
add_action( 'init', function () {
	load_plugin_textdomain(
		'ghostlabs-serendipity',
		false,
		dirname( GHOSTLABS_SERENDIPITY_PLUGIN_SLUG ) . '/languages'
	);
} );

// Boot the plugin.
use GHOSTLABS\SERENDIPITY\Kernel;

add_action( 'plugins_loaded', function () {
	try {
		Kernel::getInstance()->init()->run();
	} catch ( \Exception $e ) {
		error_log( '[Serendipity] ' . $e->getMessage() );
	}
}, 10 );

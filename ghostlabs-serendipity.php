<?php
/**
 * Plugin header — FREE (base) tier.
 *
 * The build script copies this file to the assembled plugin directory as
 * `ghostlabs-serendipity.php`. It defines the plugin constants and boots via
 * the shared bootstrap.
 *
 * @package GhostLabsSerendipity
 *
 * Plugin Name:       GhostLabs Serendipity
 * Plugin URI:        https://theghostlab.io/serendipity
 * Description:       Gallery plugin for WordPress.
 * Version:           1.0.0
 * Requires at least: 7.1
 * Requires PHP:      8.1
 * Author:            GhostLabs
 * Author URI:        https://theghostlab.io
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ghostlabs-serendipity
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Identify this tier. Shared code can branch on this if needed.
//
// ⚠️ Guarded, because every edition defines these five names. Activating another edition
// while this one is still active loads both headers in one request, until the next admin
// request switches this one off; under WP-CLI that never happens. Unguarded, every such
// request warned once per constant. Whichever header loads first wins, as it always did.
defined( 'GHOSTLABS_SERENDIPITY_EDITION' ) || define( 'GHOSTLABS_SERENDIPITY_EDITION', 'free' );
defined( 'GHOSTLABS_SERENDIPITY_VERSION' ) || define( 'GHOSTLABS_SERENDIPITY_VERSION', '1.0.0' );
defined( 'GHOSTLABS_SERENDIPITY_PLUGIN_PATH' ) || define( 'GHOSTLABS_SERENDIPITY_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
defined( 'GHOSTLABS_SERENDIPITY_PLUGIN_URL' ) || define( 'GHOSTLABS_SERENDIPITY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
defined( 'GHOSTLABS_SERENDIPITY_PLUGIN_SLUG' ) || define( 'GHOSTLABS_SERENDIPITY_PLUGIN_SLUG', plugin_basename( __FILE__ ) );

// Boot the plugin. The bootstrap lives in shared/ and is identical for every tier.
require_once GHOSTLABS_SERENDIPITY_PLUGIN_PATH . 'bootstrap.php';

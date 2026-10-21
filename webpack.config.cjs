const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// wp-scripts' own configuration, with one switch added. Entry discovery, externals and the
// asset.php files are its defaults: src/ sits inside the project in the layout this is
// compiled in, so there is nothing else to describe.
//
// `GHOSTLABS_MINIFY=0` asks for readable assets, which is what a WordPress.org reviewer
// needs to read (owner, 2026-10-08), and what the public source repo carries. `=1` or unset
// leaves wp-scripts' production build alone, which minifies. The contract is the same in
// every GhostLabs repo, and the command center sets it when it builds a submission zip.
//
// ⚠️ **wp-scripts minifies in three places, and `optimization.minimize` reaches only one of
// them.** Terser handles the JS. The CSS goes through cssnano inside postcss-loader's plugin
// list, and sass-loader defaults to `style: "compressed"` whenever webpack's mode is
// production. Turning Terser off alone leaves every stylesheet on one line, and nothing
// reports it. build.sh measures what came out for that reason.
const READABLE = process.env.GHOSTLABS_MINIFY === '0';

/**
 * One loader entry with its minification removed.
 *
 * cssnano is found by constructor name: it is a postcss `Processor` rather than a named
 * plugin, and naming it here would mean depending on a package that is wp-scripts' business.
 *
 * @param {Object|string} entry A `use` entry from a module rule.
 * @return {Object|string} The entry, copied where it changes.
 */
function readableLoader( entry ) {
	const loader = typeof entry === 'string' ? entry : entry.loader || '';
	const options = ( typeof entry === 'object' && entry.options ) || {};

	if ( loader.includes( 'postcss-loader' ) && options.postcssOptions ) {
		const plugins = ( options.postcssOptions.plugins || [] ).filter(
			( plugin ) => ! ( plugin && plugin.constructor && plugin.constructor.name === 'Processor' )
		);

		return {
			...entry,
			options: { ...options, postcssOptions: { ...options.postcssOptions, plugins } },
		};
	}

	if ( loader.includes( 'sass-loader' ) ) {
		return {
			...entry,
			options: { ...options, sassOptions: { ...options.sassOptions, style: 'expanded' } },
		};
	}

	return entry;
}

/**
 * The module rules with every minifying loader option removed.
 *
 * Copies rather than mutates: wp-scripts shares one array of CSS loaders between its .css,
 * .pcss and .scss rules.
 *
 * ⚠️ It also stops inlining the SVGs a stylesheet names. wp-scripts makes them base64 data
 * URIs, which is one unreadable line however the rest of the file is built (Undercard's
 * upgrade screen: 64,000 characters). Emitted as files instead, under the name wp-scripts
 * gives every other image. The editor's link icon (`assets/icons/link-white.svg`) is one:
 * the readable build writes it to `build/images/` and the minified build inlines it, so
 * the two `build/` trees differ by that file and that one `url()`.
 *
 * @param {Array<Object>} rules wp-scripts' module rules.
 * @return {Array<Object>} The rules, readable.
 */
function readableRules( rules ) {
	return rules.map( ( rule ) => {
		if ( rule.type === 'asset/inline' ) {
			return {
				...rule,
				type: 'asset/resource',
				generator: { filename: 'images/[name].[hash:8][ext]' },
			};
		}

		return Array.isArray( rule.use ) ? { ...rule, use: rule.use.map( readableLoader ) } : rule;
	} );
}

module.exports = {
	...defaultConfig,
	...( READABLE && {
		optimization: { ...defaultConfig.optimization, minimize: false },
		module: { ...defaultConfig.module, rules: readableRules( defaultConfig.module.rules ) },
	} ),
};

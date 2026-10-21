import * as esbuild from 'esbuild';

/**
 * This edition's one bundle.
 *
 *   dev/javascript/ghostlabs-serendipity.js  ->  assets/js/ghostlabs-serendipity-bundle.js
 *
 * The gallery. The carousel, the licensed settings app and the editor enhancement are
 * separate bundles that ship elsewhere; nothing here imports them.
 *
 * Paths are relative to this file's directory, which is the plugin root — the layout the
 * plugin is distributed in and therefore the layout its assets are compiled in. The
 * monorepo builds this same source from its other edition, whose tree is shaped
 * differently; that build is defined there, not here.
 */
const isProduction = process.env.NODE_ENV !== 'development';

/**
 * `GHOSTLABS_MINIFY=0` builds readable, `=1` minified; unset, a production build minifies.
 * The same contract as webpack.config.cjs and sass.mjs, which build the rest of the tree.
 */
const minify = {
	0: false,
	1: true,
}[ process.env.GHOSTLABS_MINIFY ] ?? isProduction;

await esbuild.build( {
	entryPoints: [ 'dev/javascript/ghostlabs-serendipity.js' ],
	outbase: 'dev/javascript',
	outdir: 'assets/js',
	entryNames: '[dir]/[name]-bundle',
	bundle: true,
	minify,
	sourcemap: ! isProduction,
	treeShaking: true,
	pure: [ 'console.log' ],
	color: true,
	loader: {
		'.jpg': 'dataurl',
		'.png': 'dataurl',
		'.svg': 'text',
		'.js': 'jsx',
	},
} );

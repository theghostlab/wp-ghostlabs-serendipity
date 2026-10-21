import fs from 'node:fs';
import path from 'node:path';
import * as sass from 'sass';

/**
 * This edition's stylesheets.
 *
 *   dev/scss/<name>.scss  ->  assets/css/<name>.css
 *
 * What `sass dev/scss:assets/css --no-source-map` does, as a script, because the style has
 * to follow the environment and a package.json script cannot read one on every platform.
 * Every `.scss` file that is not a partial compiles to the same relative path, and each
 * output ends in a newline, as the CLI writes it.
 *
 * `GHOSTLABS_MINIFY=0` builds `expanded`, `=1` and unset `compressed` — the same contract
 * as webpack.config.cjs and esbuild.mjs, which build the rest of the tree.
 *
 * Paths are relative to this file's directory, which is the plugin root, as esbuild.mjs's are.
 */
const style = process.env.GHOSTLABS_MINIFY === '0' ? 'expanded' : 'compressed';
const from = 'dev/scss';
const to = 'assets/css';

const sources = fs
	.readdirSync( from, { recursive: true } )
	.filter( ( file ) => file.endsWith( '.scss' ) && ! path.basename( file ).startsWith( '_' ) )
	.sort();

for ( const file of sources ) {
	const { css } = sass.compile( path.join( from, file ), { style, sourceMap: false } );
	const out = path.join( to, file.replace( /\.scss$/, '.css' ) );

	fs.mkdirSync( path.dirname( out ), { recursive: true } );
	fs.writeFileSync( out, css + '\n' );
}

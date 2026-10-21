/**
 * The text of an HTML fragment. Parsed, never inserted: `DOMParser` runs no script.
 *
 * @param {string} [html] The fragment.
 * @return {string} Its text.
 */
const textOf = ( html = '' ) =>
	/[<&]/.test( html )
		? ( new window.DOMParser().parseFromString( html, 'text/html' ).body
				.textContent ?? '' )
		: html;

/**
 * What a tile's photograph is called, for any control that names a tile, such as the editor
 * tile's Remove image button.
 *
 * ⚠️ Nothing on the canvas shows a tile's number, so a control named "Tile 4", or one named
 * the same on every tile, cannot tell a screen-reader author which photograph it means. The
 * photograph's alt text says what it shows; failing that its caption, and failing that its
 * file's name, without the size WordPress appends or the extension.
 *
 * A caption is HTML (the media merge copies `caption.raw`), so only its text is used: markup in
 * an accessible name is read out as markup.
 *
 * @param {Object} photograph
 * @param {string} [photograph.alt]     Its alt text.
 * @param {string} [photograph.caption] Its caption.
 * @param {string} [photograph.src]     Its URL.
 * @return {string} A name, or '' when nothing names it.
 */
export const tilePhotographName = ( { alt, caption, src } = {} ) => {
	const named = [ alt, textOf( caption ) ]
		.map( ( text ) => ( text ?? '' ).trim() )
		.find( Boolean );

	if ( named ) {
		return named;
	}

	const file = ( src ?? '' ).split( /[?#]/ )[ 0 ].split( '/' ).pop() ?? '';

	return file.replace( /\.[a-z0-9]+$/i, '' ).replace( /-\d+x\d+$/, '' );
};

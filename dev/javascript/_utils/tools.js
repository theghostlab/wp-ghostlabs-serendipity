/* eslint-disable no-bitwise */
export const uuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function ( c ) {
			const r = ( Math.random() * 16 ) | 0;
			const v = c === 'x' ? r : ( r & 0x3 ) | 0x8;
			return v.toString( 16 );
		}
	);
};
/* eslint-enable no-bitwise */

// ⚠️ String() first: a number or a boolean from a filtered payload threw here, and the
// carousel then silently did not open (re-audit, 2026-10-17).
export const escAttr = ( s ) =>
	String( s ?? '' )
		.replace( /&/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );

export const splitValueAndUnit = ( value ) => {
	const match = value.match( /^([\d.]+)([a-z%]*)$/i );
	if ( ! match ) {
		return [ 0, '' ];
	}

	return [ parseFloat( match[ 1 ] ), match[ 2 ] ];
};

/**
 * Fill a translated template's numbered placeholders (`%1$s`, `%2$s` …) in one pass.
 *
 * ⚠️ Not chained `String.replace` calls. A value went in as a replacement string, so `$&` or
 * `$$` in a caption was read as a pattern, and a value filled first was scanned again — a
 * caption containing `%1$s` had the position written into it (re-audit, 2026-10-17, A11).
 * One pass with a function replacer reads the template once and writes values as given.
 *
 * @param {string}             template A translated string.
 * @param {...(string|number)} values   The values, in placeholder order.
 * @return {string} The filled string.
 */
export const fillPlaceholders = ( template, ...values ) =>
	String( template ).replace( /%(\d+)\$s/g, ( placeholder, n ) =>
		values[ n - 1 ] === undefined ? placeholder : String( values[ n - 1 ] )
	);

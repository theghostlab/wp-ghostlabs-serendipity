/**
 * The seat's loader: an enhancement bundle fetched on first use, not on page load.
 *
 * The gallery bundle ships in every edition and knows nothing about what fills its seat.
 * An edition that has something — the built-in carousel, 43 KB of script and 6 KB of
 * style for a modal most visitors never open — tells the bundle where it lives
 * (`window.GhostLabsSerendipity.enhancement`), and the first click on a gallery that
 * needs it is what fetches it. Until then the page carries neither file.
 *
 * One promise per seat, so a second click while the first is still loading waits for
 * the same script rather than inserting another. A failed load is forgotten, so the
 * next click can try again instead of inheriting a cached rejection.
 */
const pending = new Map();

/**
 * @param {{script: string, style?: string}} seat Where the enhancement lives.
 * @param {Document}                         doc  The document to load it into.
 * @return {Promise<void>} Settles once the script has run.
 */
export const loadEnhancement = ( seat, doc = document ) => {
	const key = seat.script;

	if ( pending.has( key ) ) {
		return pending.get( key );
	}

	const promise = new Promise( ( resolve, reject ) => {
		if ( seat.style ) {
			const link = doc.createElement( 'link' );

			link.rel = 'stylesheet';
			link.href = seat.style;
			doc.head.appendChild( link );
		}

		const script = doc.createElement( 'script' );

		script.src = seat.script;
		script.async = true;
		script.addEventListener( 'load', () => resolve() );
		script.addEventListener( 'error', () => {
			pending.delete( key );
			reject( new Error( `Enhancement failed to load: ${ key }` ) );
		} );
		doc.head.appendChild( script );
	} );

	pending.set( key, promise );

	return promise;
};

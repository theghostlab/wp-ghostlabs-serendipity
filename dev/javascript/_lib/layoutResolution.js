/**
 * Which saved layout, if any, a gallery should render with.
 *
 * Layouts are saved per breakpoint, and until now the lookup was a single
 * `find( item => item.deviceType === deviceType )`. Both of its failure modes were
 * silent and both produced a *different gallery on every page load*:
 *
 * 1. **No entry for this breakpoint.** An author who composed at Desktop and never
 *    opened the Tablet tab got `null`, and the layout engine composed a fresh random
 *    mosaic — which is not the composition they approved, and not the same one twice.
 * 2. **An entry whose rectangle count no longer matches the images.** Rectangles map to
 *    images positionally, so adding an image left the last tile with no geometry (a
 *    zero-sized box at the origin) and removing one left a hole in the mosaic.
 *
 * Percentage rectangles already scale to any container (`convertToPixels`), so a layout
 * authored at one breakpoint is a far better answer at another than a random one. That
 * is what this resolves.
 */

/**
 * Narrow to wide. The order is the distance metric — Tablet is one step from either
 * neighbor, Mobile is two from Desktop.
 */
export const DEVICE_ORDER = [ 'Mobile', 'Tablet', 'Desktop' ];

/**
 * Rectangles saved as percentages of the container, rather than the legacy pixel form.
 * Only these can be borrowed across breakpoints: pixel geometry authored at 1440px
 * means nothing at 390px.
 *
 * @param {Object} entry A saved layout entry.
 * @return {boolean} Whether its rectangles scale.
 */
const isScalable = ( entry ) =>
	entry?.rectangles?.[ 0 ]?.xPercent !== undefined;

/**
 * @param {Object} entry     A saved layout entry.
 * @param {number} itemCount How many images the block currently has.
 * @return {boolean} Whether the entry still describes this gallery.
 */
const describesGallery = ( entry, itemCount ) =>
	Array.isArray( entry?.rectangles ) &&
	entry.rectangles.length === itemCount &&
	DEVICE_ORDER.includes( entry?.deviceType );

/**
 * The saved layout to use for this breakpoint.
 *
 * An exact match wins in whatever format it was saved in. Failing that, the nearest
 * breakpoint whose rectangles scale — and on a tie (Tablet, with Mobile and Desktop both
 * saved) the wider one, because a composition authored at Desktop is the one the author
 * most likely thought of as the gallery.
 *
 * @param {Array}  layoutData Saved layouts, one per breakpoint.
 * @param {string} deviceType The breakpoint being rendered.
 * @param {number} itemCount  How many images the block currently has.
 * @return {{layout: Object|null, borrowed: boolean}} The entry, and whether it came from
 * another breakpoint.
 */
export const resolveLayout = ( layoutData, deviceType, itemCount ) => {
	const usable = ( Array.isArray( layoutData ) ? layoutData : [] ).filter(
		( entry ) => describesGallery( entry, itemCount )
	);

	const exact = usable.find( ( entry ) => entry.deviceType === deviceType );

	if ( exact ) {
		return { layout: exact, borrowed: false };
	}

	const here = DEVICE_ORDER.indexOf( deviceType );

	if ( here === -1 ) {
		return { layout: null, borrowed: false };
	}

	const nearest = usable.filter( isScalable ).sort( ( a, b ) => {
		const distance =
			Math.abs( DEVICE_ORDER.indexOf( a.deviceType ) - here ) -
			Math.abs( DEVICE_ORDER.indexOf( b.deviceType ) - here );

		return (
			distance ||
			DEVICE_ORDER.indexOf( b.deviceType ) -
				DEVICE_ORDER.indexOf( a.deviceType )
		);
	} )[ 0 ];

	return nearest
		? { layout: nearest, borrowed: true }
		: { layout: null, borrowed: false };
};

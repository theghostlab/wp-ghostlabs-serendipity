import { select } from '@wordpress/data';

export const hasLayout = ( { deviceType, layoutData } ) => {
	if ( ! layoutData ) {
		return false;
	}

	return (
		layoutData.find( ( item ) => item.deviceType === deviceType ) !==
		undefined
	);
};

/**
 * Whether a breakpoint's saved layout still fits the gallery: one rectangle per image.
 *
 * `hasLayout()` answers "is there one at all", which is what Reset needs — a stale layout is
 * exactly what it clears. The "saved" indicator needs this: a layout whose count no longer
 * matches is discarded by both resolvers, so the gallery recomposes on every load, and calling
 * it saved told the author the opposite of what was happening.
 *
 * @param {Object}          args
 * @param {Array|undefined} args.layoutData The block's saved layouts.
 * @param {string}          args.deviceType The breakpoint.
 * @param {number}          args.imageCount How many images the gallery has.
 * @return {boolean} True when that breakpoint's layout is saved and still fits.
 */
export const isLayoutCurrent = ( { layoutData, deviceType, imageCount } ) =>
	( layoutData ?? [] ).some(
		( item ) =>
			item?.deviceType === deviceType &&
			( item?.rectangles?.length ?? 0 ) > 0 &&
			item.rectangles.length === imageCount
	);

// export const isLayoutSaved = (layout, deviceType) => layout.find(item => item.deviceType === deviceType) !== undefined;
export const isLayoutSaved = hasLayout;
export const getLayout = ( { layoutData, deviceType } ) =>
	layoutData.find( ( item ) => item.deviceType === deviceType );

export const isBlockIdReserved = ( blockId ) => {
	const blocks = select( 'core/block-editor' ).getBlocksByName(
		'ghostlabs/serendipity'
	);

	const test = blocks.reduce( ( a, clientId ) => {
		const attributes =
			select( 'core/block-editor' ).getBlockAttributes( clientId );

		if ( attributes?.id === blockId ) {
			a.push( attributes.id );
		}

		return a;
	}, [] );

	return test.length > 1;
};

/**
 * Select a freshly inserted gallery, and show it in the List View.
 *
 * ⚠️ Both dispatches below go to the **global** registry rather than to whichever block
 * editor is rendering this block, and that difference is not academic. Inserter pattern
 * previews render our block inside their own sub-registry; one that ran this reached past
 * itself, selected a clientId the real editor has never heard of, and forced the real
 * editor's List View open. List View and the inserter share the same sidebar slot — so
 * opening one closes the other, and the Serendipity pattern category emptied itself the
 * instant it was opened. Four previews, four dispatches, no error in the console: the
 * category simply showed nothing, on a listing that advertises four starter patterns.
 *
 * A block the global store has never seen is a block in somebody else's editor. There is
 * nothing here for it to select, and nothing of the user's to open.
 *
 * @param {string} clientId The block being inserted.
 */
export const selectBlock = ( clientId ) => {
	if ( ! wp.data.select( 'core/block-editor' ).getBlock( clientId ) ) {
		return;
	}

	wp.data.dispatch( 'core/block-editor' ).selectBlock( clientId );

	const isListViewOpened = wp.data.select( 'core/editor' ).isListViewOpened();

	if ( ! isListViewOpened ) {
		wp.data.dispatch( 'core/editor' ).setIsListViewOpened( true );
	}
};

export const setTarget = ( e ) => {
	const parent = e.target.closest( '.ghostlabs-serendipity__gallery-item' );
	return parent.querySelector( 'img' );
};

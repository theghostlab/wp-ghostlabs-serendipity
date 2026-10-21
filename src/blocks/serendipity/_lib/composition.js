import { resolveLayout } from '../../../../dev/javascript/_lib/layoutResolution';

/**
 * Why the canvas is being recomposed: what the author asked for at the current
 * breakpoint, or an attribute that changed without it.
 *
 * ⚠️ An author's request is carried out by composing the canvas **first** and changing
 * the attribute **after**, against the gallery that was actually composed. The three
 * controls once did it the other way round: they changed `layoutData` and trusted the
 * canvas to follow. It never did — `GalleryGrid` does not recompose on `layoutData` — so
 * the inspector's "Refresh Layout" cleared the attribute and left the old composition on
 * screen for "Save" to write straight back, and the toolbar's "Refresh Layout & Save"
 * saved the composition it had just replaced, from a stale closure, on a timer. Undo and
 * redo are the other direction — the attribute moves first — and `FOLLOW` is how the
 * canvas catches up.
 */
export const COMPOSE = {
	/** A new composition, left unsaved for the author to keep or refresh again. */
	REFRESH: 'refresh',
	/** A new composition, saved as soon as it is on the canvas. */
	REFRESH_AND_SAVE: 'refresh-and-save',
	/** The breakpoint unsaved: whatever the front end would show in its place. */
	RESET: 'reset',
	/** The attribute changed underneath the canvas (undo, redo): compose it as a reload would. */
	FOLLOW: 'follow',
};

const NOTHING_SAVED = { layout: null, borrowed: false };

/**
 * Which saved layout, if any, the canvas should be composed from.
 *
 * With no request, or to follow the attribute, this is exactly the front end's
 * resolution. A refresh ignores every saved entry — the nearest breakpoint's composition
 * is not a new one, and borrowing it is how the toolbar's refresh once "refreshed" Desktop
 * into a copy of Tablet. A reset
 * resolves as though this breakpoint had never been saved, which is what the front end
 * will do once the entry is gone.
 *
 * @param {Array<Object>} layoutData The saved layouts, every breakpoint.
 * @param {string}        deviceType The breakpoint being composed.
 * @param {number}        imageCount How many images the gallery has.
 * @param {string|null}   request    One of COMPOSE, or null.
 * @return {{layout: Object|null, borrowed: boolean}} As `resolveLayout()`.
 */
export const resolveComposition = (
	layoutData,
	deviceType,
	imageCount,
	request = null
) => {
	if ( request === COMPOSE.REFRESH || request === COMPOSE.REFRESH_AND_SAVE ) {
		return NOTHING_SAVED;
	}

	const source =
		request === COMPOSE.RESET
			? layoutData.filter( ( datum ) => datum.deviceType !== deviceType )
			: layoutData;

	return resolveLayout( source, deviceType, imageCount );
};

/**
 * `layoutData` with one breakpoint's composition saved into it.
 *
 * Every other breakpoint is kept, and nothing is written into the array or the entries it
 * was given — both belong to the block editor.
 *
 * @param {Array<Object>} layoutData The saved layouts, every breakpoint.
 * @param {string}        deviceType The breakpoint being saved.
 * @param {Object}        layout     What the composer produced for it.
 * @return {Array<Object>} The layouts to save.
 */
export const withLayout = ( layoutData, deviceType, layout ) =>
	layoutData.some( ( datum ) => datum.deviceType === deviceType )
		? layoutData.map( ( datum ) =>
				datum.deviceType === deviceType
					? { ...datum, ...layout }
					: datum
		  )
		: [ ...layoutData, layout ];

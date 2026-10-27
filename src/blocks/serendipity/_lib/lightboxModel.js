import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

import { FILTER } from './editionHooks';

/**
 * The lightbox modes every edition has. Mirrors the PHP enum of the same name.
 *
 * Three emit a plain anchor and let whatever lightbox the site already runs pick the gallery
 * up, and one emits none. An edition adds a mode of its own through `FILTER.LIGHTBOX_MODES`.
 */
export const LIGHTBOX = {
	OWN: 'own',
	FILE: 'file',
	ATTACHMENT: 'attachment',
	NONE: 'none',
};

export const LIGHTBOX_DEFAULT = LIGHTBOX.OWN;

/**
 * The modes, in the select's order, with names and help resolved when asked.
 *
 * A mode an edition adds may carry `claims( attributes )` — whether a block with no `lightbox`
 * value asked for it some older way — and `Settings`, a component rendered under the select
 * while the mode is chosen, handed `{ attributes, setAttributes }`.
 *
 * @return {Array<{label: string, value: string, help: string, claims?: Function, Settings?: Function}>} The modes.
 */
export const lightboxModes = () =>
	applyFilters( FILTER.LIGHTBOX_MODES, [
		{
			label: __(
				'Your lightbox plugin (default)',
				'ghostlabs-serendipity'
			),
			value: LIGHTBOX.OWN,
			help: __(
				'Links each image to the full-size file and groups the gallery, so a lightbox plugin you already run can pick it up.',
				'ghostlabs-serendipity'
			),
		},
		{
			label: __( 'Link to image file', 'ghostlabs-serendipity' ),
			value: LIGHTBOX.FILE,
			help: __(
				'Each image links to the full-size file, ungrouped — for lightboxes that do their own grouping.',
				'ghostlabs-serendipity'
			),
		},
		{
			label: __( 'Link to attachment page', 'ghostlabs-serendipity' ),
			value: LIGHTBOX.ATTACHMENT,
			help: __(
				'Each image links to its attachment page.',
				'ghostlabs-serendipity'
			),
		},
		{
			label: __( 'No link', 'ghostlabs-serendipity' ),
			value: LIGHTBOX.NONE,
			help: __(
				'Images are not linked. Nothing happens on click.',
				'ghostlabs-serendipity'
			),
		},
	] );

/**
 * @param {string} value A lightbox mode.
 * @return {Object|undefined} The mode, where this editor offers it.
 */
export const lightboxModeFor = ( value ) =>
	lightboxModes().find( ( mode ) => mode.value === value );

/**
 * What the gallery uses: the stored mode where this editor offers it, and `LIGHTBOX_DEFAULT`
 * for anything else, as the render does.
 *
 * @param {Object} attributes The block's attributes.
 * @return {string} The mode in effect.
 */
export const lightboxInEffect = ( attributes ) => {
	const lightbox = attributes?.lightbox;

	if ( ! lightbox ) {
		const claimed = lightboxModes().find( ( mode ) =>
			mode.claims?.( attributes ?? {} )
		);

		return claimed ? claimed.value : LIGHTBOX_DEFAULT;
	}

	return lightboxModeFor( lightbox ) ? lightbox : LIGHTBOX_DEFAULT;
};

/**
 * @return {Array<{label: string, value: string}>} Options for the SelectControl.
 */
export const lightboxOptions = () =>
	lightboxModes().map( ( { label, value } ) => ( { label, value } ) );

/**
 * The help text under the select, which is where the mode earns its keep.
 *
 * @param {string} value A lightbox mode.
 * @return {string} Help text.
 */
export const lightboxHelp = ( value ) =>
	lightboxModeFor( value )?.help ?? lightboxModeFor( LIGHTBOX_DEFAULT ).help;

import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

import { FILTER } from './editionHooks';

/**
 * Fade-Up: the hover style every edition renders, and what a stored style this editor does not
 * offer renders as (`Service\Serendipity::hoverStyle()`).
 */
export const FADE_UP = 'style-1';

/**
 * The hover styles every edition renders: None, and Fade-Up. An edition adds its own through
 * `FILTER.HOVER_STYLES`, each with a `Tile` for its preview where it has markup of its own.
 *
 * ⚠️ **The labels resolve when asked, never at import.** This module is imported once, early;
 * a list built at module scope bakes in whichever locale loaded first.
 *
 * @return {Array<{label: string, value: string, Tile?: Function}>} The styles, in order.
 */
export const hoverStyles = () =>
	applyFilters( FILTER.HOVER_STYLES, [
		{ label: __( 'None', 'ghostlabs-serendipity' ), value: '' },
		{ label: __( 'Fade-Up', 'ghostlabs-serendipity' ), value: FADE_UP },
	] );

/**
 * @param {string} value A hover style value.
 * @return {Object|undefined} The style, where this editor offers it.
 */
export const hoverStyleFor = ( value ) =>
	hoverStyles().find( ( style ) => style.value === value );

/**
 * What the gallery renders for a stored style: the stored one where this editor offers it, and
 * Fade-Up for anything else, as the render does.
 *
 * @param {string|undefined} stored The block's hover style.
 * @return {string} The style in effect.
 */
export const hoverStyleInEffect = ( stored ) => {
	const value = stored ?? '';

	return hoverStyleFor( value ) ? value : FADE_UP;
};

/**
 * @return {Array<{label: string, value: string}>} Options for the SelectControl.
 */
export const hoverStyleOptions = () =>
	hoverStyles().map( ( { label, value } ) => ( { label, value } ) );

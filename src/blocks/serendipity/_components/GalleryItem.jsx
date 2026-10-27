/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';
import { hoverStyleFor, hoverStyleInEffect } from '../_lib/stylesModel';
import { tilePhotographName } from '../_lib/tileNames';
import {
	GALLERY_ITEM_CLASS,
	GALLERY_ITEM_SELECTOR,
} from '../../../../dev/javascript/_lib/constants';

/**
 * Gallery item component that displays an image with hover effects and remove functionality.
 *
 * @param {Object}   props            - Component properties.
 * @param {Object}   props.image      - Image object containing url, alt, caption, and id.
 * @param {number}   props.index      - Index of the image in the gallery.
 * @param {Function} props.onRemove   - Called with the image, its index, and whether the button
 *                                      had focus (a keyboard press) when it was pressed.
 * @param {string}   props.hoverStyle - The block's hover style.
 * @return {JSX.Element} Gallery item component.
 */
const GalleryItem = ( { image, index, onRemove, hoverStyle } ) => {
	// What the site shows: a style this editor does not offer renders as Fade-Up, as it does there.
	const style = hoverStyleInEffect( hoverStyle );
	const Tile = hoverStyleFor( style )?.Tile;

	const name = tilePhotographName( {
		alt: image.alt,
		caption: image.caption,
		src: image.url,
	} );

	// Every tile's button said "Remove image", so a list of buttons was five of the same.
	const removeLabel = name
		? sprintf(
				/* translators: %s: the photograph's alt text, caption or file name. */
				__( 'Remove image: %s', 'ghostlabs-serendipity' ),
				name
			)
		: __( 'Remove image', 'ghostlabs-serendipity' );

	const classes = [
		GALLERY_ITEM_SELECTOR.replace( /^\.+/, '' ),
		`${ GALLERY_ITEM_CLASS }--${ style }`,
	]
		.filter( Boolean )
		.join( ' ' );

	const photograph = (
		<img
			src={ image.url }
			alt={ image.alt || '' }
			data-id={ image.id }
			data-index={ index }
		/>
	);

	return (
		// A list item, focusable so the keyboard can reveal Remove and so Layout Studio's Pan &
		// tilt can follow the tile in focus. ⚠️ Not role="button": it activates nothing, and the
		// role took its list-item semantics away and nested the Remove button inside a button
		// (accessibility audit, 2026-10-16 — the front end lost the same role on 2026-09-26).
		<li
			className={ classes }
			data-caption={ image.caption || '' }
			tabIndex={ 0 }
		>
			{ /* A style an edition adds draws its own markup around the photograph. */ }
			{ Tile ? (
				<Tile caption={ image.caption || '' }>{ photograph }</Tile>
			) : (
				photograph
			) }

			{ /* Shown by editor.scss on :hover and :focus-within, never by React state, and placed
			 * over the photograph's corner: see there. */ }
			<div className="gallery-item-actions">
				<Button
					className="remove-button"
					// ⚠️ An SVG, not a Dashicon name: the canvas is an iframe that loads no
					// dashicons font, and "no-alt" rendered as an empty square (2026-10-18).
					icon={ closeSmall }
					label={ removeLabel }
					// ⚠️ A mouse press must not move focus here. Firefox and Safari scroll a newly
					// focused element into view, and this button sits at the tile's bottom edge: when
					// that edge was at the bottom of the canvas, the press scrolled the page, the
					// release landed on the canvas, and no click ever reached the button (2026-10-18).
					// Keyboard focus and Enter/Space are untouched.
					onMouseDown={ ( event ) => event.preventDefault() }
					onClick={ ( event ) =>
						onRemove(
							image,
							index,
							event.currentTarget.ownerDocument.activeElement ===
								event.currentTarget
						)
					}
				/>
			</div>
		</li>
	);
};

export default GalleryItem;

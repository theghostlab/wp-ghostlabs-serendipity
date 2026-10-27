import { useEffect, useState } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';

/**
 * Where an edition adds to the block's editor. The block is built once, from `shared/`, and
 * ships to every edition, so it renders what every edition has and lets an edition's own
 * script add the rest through these filters. A build that adds nothing — the free one — offers
 * exactly what it renders.
 *
 * ⚠️ WordPress.org Guideline 5: a free build may not carry an option it withholds. This is how
 * another edition's options stay out of it entirely (refused 2026-10-26).
 */
export const FILTER = {
	/** `( styles ) => styles` — `{ label, value, Tile? }`, see `_lib/stylesModel`. */
	HOVER_STYLES: 'ghostlabs.serendipity.hoverStyles',
	/** `( modes ) => modes` — `{ label, value, help, claims?, Settings? }`, see `_lib/lightboxModel`. */
	LIGHTBOX_MODES: 'ghostlabs.serendipity.lightboxModes',
	/** `( Control ) => Control` — the Hover Styles select, see `GalleryInspectorControls`. */
	HOVER_STYLE_CONTROL: 'ghostlabs.serendipity.hoverStyleControl',
	/** `( Control ) => Control` — the Lightbox select, see `GalleryInspectorControls`. */
	LIGHTBOX_CONTROL: 'ghostlabs.serendipity.lightboxControl',
	/** `( paint ) => paint` — `( item, rectangle )` after the canvas places a tile; see `Serendipity()`. */
	PAINT_TILE: 'ghostlabs.serendipity.paintTile',
};

let instances = 0;

const FILTERS = Object.values( FILTER );

/**
 * Render again when an edition adds to one of these filters after the block rendered.
 *
 * Load order between the block's script and an edition's is not guaranteed, so a filter can be
 * added after the first render. `hookAdded` says so. Called once, by the block's edit function:
 * everything below it reads the filters as it renders.
 */
export const useEditionFilters = () => {
	const [ , setVersion ] = useState( 0 );

	useEffect( () => {
		const namespace = `ghostlabs-serendipity/edition-filters/${ ++instances }`;
		const follow = ( hookName ) => {
			if ( FILTERS.includes( hookName ) ) {
				setVersion( ( version ) => version + 1 );
			}
		};

		addAction( 'hookAdded', namespace, follow );
		addAction( 'hookRemoved', namespace, follow );

		return () => {
			removeAction( 'hookAdded', namespace );
			removeAction( 'hookRemoved', namespace );
		};
	}, [] );
};

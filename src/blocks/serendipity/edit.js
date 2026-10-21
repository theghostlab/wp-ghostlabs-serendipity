/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { rotateLeft, update } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import GalleryGrid from './_components/GalleryGrid';
import MediaUploadControl from './_components/MediaUploadControl';
import GalleryInspectorControls from './_components/GalleryInspectorControls';
import LayoutStudioSeat from './_components/LayoutStudioSeat';
import DeviceSwitcher from './_components/DeviceSwitcher';
import {
	hasLayout,
	isBlockIdReserved,
	isLayoutSaved,
	selectBlock,
} from './_lib/_blockUtils';
import { COMPOSE, withLayout } from './_lib/composition';
import { LIGHTBOX } from './_lib/lightboxModel';

const GALLERY_ID_PREFIX = 'ghostlabs-serendipity-gallery';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               - Block properties.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {string}   props.clientId      - Block client ID.
 * @param {boolean}  props.isSelected    - Whether the block is selected.
 * @return {Element} Element to render.
 */
export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
} ) {
	/**
	 * Returns the current deviceType.
	 */
	const deviceType = useSelect( ( select ) =>
		select( 'core/editor' ).getDeviceType()
	);

	const {
		align,
		carousel,
		lightbox,
		controls,
		debug,
		id,
		imageResolution,
		thumbnailSize,
		gap,
		hoverStyle,
		layoutData,
		minHeight,
		rawImages,
		showCarouselCaptions,
		mobileStackThumbnails,
		autoplay,
		autoplayDelay,
	} = attributes;

	const [ gallery, setGallery ] = useState( null );
	const [ aspectRatio, setAspectRatio ] = useState( 'auto' );
	const [ , setLayoutSaved ] = useState(
		isLayoutSaved( { layoutData, deviceType } )
	);
	const [ recompose, setRecompose ] = useState( {
		count: 0,
		mode: null,
		deviceType: null,
	} );

	// The `layoutData` the canvas agrees with: the one it was last composed from, or the
	// one this component last wrote to match it. A value arriving in the attribute that is
	// neither came from outside — undo, redo — and the canvas is recomposed from it below.
	const canvasLayoutData = useRef( layoutData );

	/**
	 * Write attributes. Straight to the block, in one call per change, so that each
	 * change is one undo step and undo reaches everything that reads them.
	 *
	 * ⚠️ These went through a private store once: a copy of every attribute taken on
	 * mount, merged with each change and written back whole. Undo never reached the copy,
	 * so the next change to any setting silently re-did whatever had just been undone.
	 *
	 * @param {Object} changes The attributes to change.
	 */
	const writeAttributes = ( changes ) => {
		if ( 'layoutData' in changes ) {
			canvasLayoutData.current = changes.layoutData;
		}

		setAttributes( changes );
	};

	const handleChange = ( key, value ) =>
		writeAttributes( { [ key ]: value } );

	// Generate a unique ID for the gallery if one doesn't exist
	useEffect( () => {
		const newGalleryId = `${ GALLERY_ID_PREFIX }-${ clientId.slice(
			0,
			8
		) }`;

		if ( ! id ) {
			handleChange( 'id', newGalleryId );
			selectBlock( clientId );
			return;
		}

		if ( isBlockIdReserved( id ) ) {
			handleChange( 'id', newGalleryId );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ id, clientId ] );

	// Check parent block alignment changes
	const parentBlockClientId = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlockParentsByBlockName(
				clientId,
				'core/group'
			)[ 0 ]
	);

	const parentBlockAttributes = useSelect(
		( select ) =>
			parentBlockClientId
				? select( 'core/block-editor' ).getBlockAttributes(
						parentBlockClientId
				  )
				: null,
		[ parentBlockClientId ]
	);

	// Fetch full image data for any images that might be missing details
	const imageIds = rawImages.map( ( img ) => img.id ).filter( Boolean );
	const mediaData = useSelect(
		( select ) => {
			if ( ! imageIds.length ) {
				return [];
			}
			return select( coreStore ).getEntityRecords(
				'postType',
				'attachment',
				{
					include: imageIds,
					per_page: imageIds.length,
				}
			);
		},
		[ imageIds ]
	);

	// Merge media data with our existing images if needed
	useEffect( () => {
		if ( mediaData && mediaData.length > 0 ) {
			const updatedImages = rawImages.map( ( image ) => {
				if ( ! image.id ) {
					return image;
				}

				const mediaItem = mediaData.find(
					( media ) => media.id === image.id
				);
				if ( mediaItem ) {
					return {
						...image,
						url: mediaItem?.source_url || image.url,
						alt: image.alt || mediaItem.alt_text || '',
						caption: image.caption || mediaItem.caption?.raw || '',
					};
				}
				return image;
			} );

			if (
				JSON.stringify( updatedImages ) !== JSON.stringify( rawImages )
			) {
				// setAttributes({ rawImages: updatedImages });
				handleChange( 'rawImages', updatedImages );
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ mediaData, rawImages ] );

	// Block props for the outer wrapper
	const blockProps = useBlockProps( {
		className: 'serendipity-gallery-block',
		'data-gallery-id': id,
	} );

	// Update images from media library
	const updateImages = ( newImages ) => {
		handleChange( 'rawImages', newImages );
	};

	/**
	 * A tile's own Remove button.
	 *
	 * ⚠️ By identity, not by id: the same attachment can sit in a gallery twice, and
	 * removing by id would take both. Until 2026-10-15 nothing passed this down at all,
	 * and the button called `undefined` — it showed on hover and did nothing.
	 *
	 * @param {Object} image The `rawImages` entry the tile was rendered from.
	 */
	const removeImage = ( image ) => {
		handleChange(
			'rawImages',
			rawImages.filter( ( candidate ) => candidate !== image )
		);
	};

	// Update gap between images
	const updateGap = ( newGap ) => {
		handleChange( 'gap', newGap );
	};

	/**
	 * A saved breakpoint carries its own height; an unsaved one has only the attribute.
	 *
	 * The saved entry is replaced, not written into: undo goes back to the object it had,
	 * and one already holding the new height is nothing to go back to. An unsaved
	 * breakpoint once got a `{ minHeight }` entry of its own, with no breakpoint on it —
	 * nothing reads one — appended again for every step of the slider.
	 *
	 * @param {string} newMinHeight The height, with its unit.
	 */
	const updateMinHeight = ( newMinHeight ) => {
		writeAttributes( {
			minHeight: newMinHeight,
			...( hasLayout( { deviceType, layoutData } ) && {
				layoutData: layoutData.map( ( datum ) =>
					datum.deviceType === deviceType
						? { ...datum, minHeight: newMinHeight }
						: datum
				),
			} ),
		} );
	};

	/**
	 * The mode, and the legacy boolean older saved blocks still carry, kept in step rather
	 * than leaving a stale `true` behind for the render to resolve. One write, so one undo
	 * step: as two, undoing once left a block with the built-in carousel both on and off.
	 *
	 * @param {string} value One of LIGHTBOX.
	 */
	const updateLightbox = ( value ) => {
		writeAttributes( {
			lightbox: value,
			carousel: value === LIGHTBOX.BUILT_IN,
		} );
	};

	const setDebug = ( value ) => {
		handleChange( 'debug', value );
	};

	/**
	 * Reframing and reordering used to live here, behind a 500ms long press on a tile.
	 * Both are Layout Studio's now, in the bundle the licensed edition enqueues, which
	 * is where they belong on two counts: they are paid features, and the block ships to
	 * every edition. The hold is gone with them; a drag starts immediately and the tile's
	 * own boundary decides whether it is a crop or a swap.
	 */

	/**
	 * Save a composed gallery as this breakpoint's layout.
	 *
	 * @param {Object} composed      The Serendipity instance whose composition to save.
	 * @param {string} composedRatio The aspect ratio it was composed at.
	 */
	const writeLayout = ( composed, composedRatio ) => {
		const rawLayoutData = composed.getLayoutData();

		handleChange(
			'layoutData',
			withLayout( layoutData, deviceType, {
				deviceType,
				aspectRatio: composedRatio,
				rawLayoutData,
				rectangles: rawLayoutData.rectangles,
				minHeight,
			} )
		);

		setLayoutSaved( true );
	};

	const saveLayout = () => writeLayout( gallery, aspectRatio );

	/**
	 * Layout Studio's commit: the rectangles it dragged out, saved for this breakpoint.
	 *
	 * The same field the random composer writes, so a dragged composition and a generated
	 * one are the same thing by the time anything else reads them. A breakpoint that was
	 * borrowing another's layout gets its own entry here, which is what turns an adjusted
	 * borrowing into an authored composition.
	 *
	 * @param {Array<Object>} rectangles The composition Layout Studio dragged out.
	 */
	const updateRectangles = ( rectangles ) => {
		const existing = layoutData.find(
			( datum ) => datum.deviceType === deviceType
		);

		const updated = existing
			? layoutData.map( ( datum ) =>
					datum.deviceType === deviceType
						? { ...datum, rectangles }
						: datum
			  )
			: [
					...layoutData,
					{
						deviceType,
						aspectRatio,
						rawLayoutData: [],
						rectangles,
						minHeight,
					},
			  ];

		handleChange( 'layoutData', updated );
		setLayoutSaved( true );
	};

	const resetLayout = () => {
		const tmp = layoutData.filter(
			( datum ) => datum.deviceType !== deviceType
		);
		handleChange( 'layoutData', tmp );
		setLayoutSaved( false );
	};

	const updateThumbnailSize = ( newSize ) => {
		handleChange( 'thumbnailSize', newSize );
	};

	const updateMobileStackThumbnails = ( value ) => {
		handleChange( 'mobileStackThumbnails', value );
	};

	const updateImageResolution = ( newSize ) => {
		handleChange( 'imageResolution', newSize );
	};

	const updateHoverStyle = ( newHoverStyle ) => {
		handleChange( 'hoverStyle', newHoverStyle );
	};

	const updateControls = ( newControls ) => {
		handleChange( 'controls', newControls );
	};

	const updateShowCarouselCaptions = ( value ) => {
		handleChange( 'showCarouselCaptions', value );
	};

	const updateAutoplay = ( value ) => {
		handleChange( 'autoplay', value );
	};

	const updateAutoplayDelay = ( value ) => {
		handleChange( 'autoplayDelay', value );
	};

	/**
	 * Ask the canvas to recompose this breakpoint. The attribute changes only once the
	 * new composition is on screen, in `composed()` below — see `COMPOSE`.
	 *
	 * @param {string} mode One of COMPOSE.
	 */
	const requestComposition = ( mode ) => {
		setRecompose( ( { count } ) => ( {
			count: count + 1,
			mode,
			deviceType,
		} ) );
	};

	// The attribute changed underneath the canvas — see `canvasLayoutData`.
	useEffect( () => {
		if ( layoutData === canvasLayoutData.current ) {
			return;
		}

		canvasLayoutData.current = layoutData;
		requestComposition( COMPOSE.FOLLOW );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ layoutData ] );

	/**
	 * A requested composition has reached the canvas.
	 *
	 * @param {Object} composition
	 * @param {Object} composition.gallery     The instance just composed.
	 * @param {string} composition.aspectRatio The aspect ratio it was composed at.
	 * @param {string} composition.mode        What was asked for.
	 */
	const composed = ( {
		gallery: composedGallery,
		aspectRatio: composedRatio,
		mode,
	} ) => {
		if ( mode === COMPOSE.REFRESH_AND_SAVE ) {
			writeLayout( composedGallery, composedRatio );
			return;
		}

		// A refresh is left for the author to save; a reset is unsaved by definition.
		// Either way the saved entry would now describe something the canvas no longer
		// shows, and "Save" appearing in its place is what tells the author so.
		if ( mode === COMPOSE.REFRESH || mode === COMPOSE.RESET ) {
			resetLayout();
		}
	};

	return (
		<div { ...blockProps }>
			<GalleryInspectorControls
				key={ 'ghostlabs-serendipity-gallery-inspector-controls' }
				carousel={ carousel }
				lightbox={ lightbox }
				controls={ controls }
				debug={ debug }
				gap={ gap }
				id={ id }
				deviceType={ deviceType }
				layoutData={ layoutData }
				imageCount={ rawImages.length }
				hoverStyle={ hoverStyle }
				minHeight={ minHeight }
				imageResolution={ imageResolution }
				thumbnailSize={ thumbnailSize }
				showCarouselCaptions={ showCarouselCaptions }
				autoplay={ autoplay }
				autoplayDelay={ autoplayDelay }
				onAutoplay={ updateAutoplay }
				onAutoplayDelay={ updateAutoplayDelay }
				mobileStackThumbnails={ mobileStackThumbnails }
				onMobileStackThumbnails={ updateMobileStackThumbnails }
				onImageResolution={ updateImageResolution }
				onChangeGap={ updateGap }
				onChangeMinHeight={ updateMinHeight }
				onSaveLayout={ saveLayout }
				onRefreshLayout={ () => requestComposition( COMPOSE.REFRESH ) }
				onThumbnailSize={ updateThumbnailSize }
				onHoverStyle={ updateHoverStyle }
				onLightbox={ updateLightbox }
				onControls={ updateControls }
				onShowCarouselCaptions={ updateShowCarouselCaptions }
				onDebug={ setDebug }
			/>

			{ rawImages.length > 0 ? (
				<>
					<GalleryGrid
						key={ 'ghostlabs-serendipity-gallery-grid' }
						align={ align }
						parentClientId={ clientId }
						deviceType={ deviceType }
						images={ rawImages }
						onRemoveImage={ removeImage }
						gap={ gap }
						hoverStyle={ hoverStyle }
						layoutData={ layoutData }
						minHeight={ minHeight }
						parentBlockClientId={ parentBlockClientId }
						parentBlockAttributes={ parentBlockAttributes }
						recompose={ recompose }
						onComposed={ composed }
						setGallery={ setGallery }
						setAspectRatio={ setAspectRatio }
					/>

					{ /* The licensed edition fills this; every other renders nothing. */ }
					{ isSelected && (
						<LayoutStudioSeat
							gallery={ gallery }
							layoutData={ layoutData }
							deviceType={ deviceType }
							gap={ gap }
							imageCount={ rawImages.length }
							onChangeRectangles={ updateRectangles }
						/>
					) }
				</>
			) : (
				<div
					key={ 'ghostlabs-serendipity-media-upload-control' }
					className="serendipity-gallery-block__empty-gallery-placeholder"
				>
					<p>
						{ __(
							'Add images to create your gallery',
							'ghostlabs-serendipity'
						) }
					</p>
					<MediaUploadControl
						images={ rawImages }
						onUpdateImages={ updateImages }
					/>
				</div>
			) }

			<BlockControls key={ 'ghostlabs-serendipity-block-controls' }>
				{ /*
				 * ⚠️ A plain container, not a <Toolbar>: BlockControls already sits in the block
				 * toolbar, and a Toolbar inside it was a second role="toolbar" with an
				 * English-only name (accessibility audit, 2026-10-16). Same classes the Toolbar
				 * rendered, so it looks exactly as it did; the buttons keep the block toolbar's
				 * arrow-key navigation through their own context. A <ToolbarGroup> here adds a
				 * divider and widens the toolbar by 11px.
				 */ }
				<div className="components-accessible-toolbar ghostlabs-serendipity-toolbar">
					<DeviceSwitcher
						deviceType={ deviceType }
						layoutData={ layoutData }
						imageCount={ rawImages.length }
					/>

					<ToolbarGroup>
						<MediaUploadControl
							images={ rawImages }
							onUpdateImages={ updateImages }
							toolbar={ true }
						/>

						<ToolbarButton
							icon={ update }
							label={ __(
								'Refresh Layout & Save',
								'ghostlabs-serendipity'
							) }
							onClick={ () =>
								requestComposition( COMPOSE.REFRESH_AND_SAVE )
							}
						/>

						{ hasLayout( { deviceType, layoutData } ) &&
							! isBlockIdReserved( id ) && (
								<ToolbarButton
									icon={ rotateLeft }
									label={ __(
										'Reset Gallery Layout',
										'ghostlabs-serendipity'
									) }
									onClick={ () =>
										requestComposition( COMPOSE.RESET )
									}
								/>
							) }
					</ToolbarGroup>
				</div>
			</BlockControls>
		</div>
	);
}

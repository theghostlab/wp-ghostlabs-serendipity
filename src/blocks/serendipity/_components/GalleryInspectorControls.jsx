/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
	RadioControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalText as Text,
	Flex,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { select } from '@wordpress/data';
import {
	hoverRefusalCopy,
	hoverRunning,
	hoverStyleOptions,
	isLockedHoverStyle,
} from '../_lib/stylesModel';
import {
	LIGHTBOX,
	LIGHTBOX_DEFAULT,
	isLockedLightbox,
	lightboxHelp,
	lightboxOptions,
	lightboxRefusalCopy,
	lightboxRunning,
} from '../_lib/lightboxModel';
import RefusableSelect from './RefusableSelect';
import { getLayout, isLayoutCurrent } from '../_lib/_blockUtils';

/**
 * Inspector controls component for the Gallery block.
 *
 * ⚠️ Every control reads its value from the block's attributes, never from a copy of its
 * own. The copies this once kept were taken on mount and changed only by the controls
 * themselves, so undo reverted the block and left the sidebar showing what had been
 * undone.
 *
 * @param {Object}   props                         - Component properties
 * @param {boolean}  props.carousel                - Legacy flag; superseded by props.lightbox
 * @param {string}   props.lightbox                - Which lightbox a click opens
 * @param {Function} props.onLightbox              - Callback when the lightbox mode changes
 * @param {string}   props.controls                - Type of carousel controls to display
 * @param {string}   props.deviceType              - Current device type (mobile, tablet, desktop)
 * @param {string}   props.gap                     - Gap size between images
 * @param {string}   props.hoverStyle              - Style to apply on image hover
 * @param {Array}    props.layoutData              - Layout configuration for different device types
 * @param {number}   props.imageCount              - How many images the gallery has
 * @param {string}   props.minHeight               - Minimum height of the gallery
 * @param {Function} props.onChangeGap             - Callback when gap size changes
 * @param {Function} props.onChangeMinHeight       - Callback when minimum height changes
 * @param {Function} props.onSaveLayout            - Callback to save current layout
 * @param {Function} props.onRefreshLayout         - Callback to compose a new layout, left unsaved
 * @param {Function} props.onHoverStyle            - Callback when hover style changes
 * @param {Function} props.onThumbnailSize         - Callback when thumbnail size changes
 * @param {Function} props.onControls              - Callback when carousel controls change
 * @param {boolean}  props.debug
 * @param {string}   props.thumbnailSize           - The saved thumbnail size, what the control shows
 * @param {string}   props.imageResolution
 * @param {boolean}  props.showCarouselCaptions
 * @param {boolean}  props.autoplay                - Whether the carousel plays on its own
 * @param {number}   props.autoplayDelay           - Seconds per slide
 * @param {Function} props.onAutoplay              - Callback when autoplay is toggled
 * @param {Function} props.onAutoplayDelay         - Callback when the delay changes
 * @param {boolean}  props.mobileStackThumbnails
 * @param {Function} props.onMobileStackThumbnails
 * @param {Function} props.onImageResolution
 * @param {Function} props.onShowCarouselCaptions
 * @param {Function} props.onDebug
 * @return {JSX.Element} Inspector controls panel
 */
const GalleryInspectorControls = ( {
	carousel,
	controls,
	lightbox,
	onLightbox,
	debug,
	deviceType,
	gap,
	imageResolution,
	thumbnailSize,
	hoverStyle,
	layoutData,
	imageCount,
	minHeight,
	showCarouselCaptions,
	autoplay,
	autoplayDelay,
	onAutoplay,
	onAutoplayDelay,
	mobileStackThumbnails,
	onMobileStackThumbnails,
	onChangeGap,
	onChangeMinHeight,
	onImageResolution,
	onSaveLayout,
	onRefreshLayout,
	onHoverStyle,
	onThumbnailSize,
	onControls,
	onShowCarouselCaptions,
	onDebug,
} ) => {
	const gapValue = parseInt( gap, 10 ) || 1;

	// A saved breakpoint carries its own height; an unsaved one shows the attribute's.
	const layout = getLayout( { deviceType, layoutData } );
	const minHeightValue =
		parseInt( layout?.minHeight ?? minHeight, 10 ) || 360;

	const imageSizes = select( 'core/block-editor' ).getSettings().imageSizes;

	const thumbnailSizes = imageSizes.map( ( { slug, name } ) => ( {
		label: name,
		value: slug,
	} ) );

	const imageResolutions = imageSizes
		.map( ( { slug, name } ) => ( {
			label: name,
			value: slug,
		} ) )
		.filter( ( { value } ) => value !== 'thumbnail' );

	// From the attribute, not a constant: this used to start at 'medium' whatever the
	// block said, so a pattern inserted with 'large' showed Medium in the sidebar.
	const thumbnailSizeValue = thumbnailSize || 'medium';
	const lightboxValue =
		lightbox || ( carousel ? LIGHTBOX.BUILT_IN : LIGHTBOX_DEFAULT );

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Layout Settings', 'ghostlabs-serendipity' ) }
			>
				<RangeControl
					label={ __( 'Gap Size (px)', 'ghostlabs-serendipity' ) }
					value={ gapValue }
					onChange={ ( value ) => onChangeGap( `${ value }px` ) }
					min={ 1 }
					max={ 10 }
					step={ 1 }
					__next40pxDefaultSize={ true }
					__nextHasNoMarginBottom={ true }
				/>
				<RangeControl
					label={ __(
						'Minimum Height (px)',
						'ghostlabs-serendipity'
					) }
					value={ minHeightValue }
					onChange={ ( value ) =>
						onChangeMinHeight( `${ value }px` )
					}
					min={ 360 }
					max={ 720 }
					step={ 1 }
					__next40pxDefaultSize={ true }
					__nextHasNoMarginBottom={ true }
				/>
				<Spacer marginTop={ -2 } marginBottom={ 8 }>
					<Text size="14" variant={ 'muted' }>
						{ __(
							`Set a minimum display height for the tiled gallery.`,
							'ghostlabs-serendipity'
						) }
					</Text>
				</Spacer>
				<SelectControl
					label={ __(
						'Thumbnail resolution',
						'ghostlabs-serendipity'
					) }
					value={ thumbnailSizeValue }
					options={ thumbnailSizes }
					onChange={ onThumbnailSize }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
				{ /*
				 * The licensed three answer the click: the block keeps its style, and the
				 * notice names the pick and the style still in effect. See RefusableSelect.
				 */ }
				<RefusableSelect
					label={ __( 'Hover Styles', 'ghostlabs-serendipity' ) }
					stored={ hoverStyle }
					options={ hoverStyleOptions }
					isLocked={ isLockedHoverStyle }
					copy={ ( notice ) =>
						hoverRefusalCopy( {
							...notice,
							running: hoverRunning( hoverStyle ),
						} )
					}
					onChange={ onHoverStyle }
				/>
				{ deviceType === 'Mobile' ? (
					<Spacer marginTop={ 6 }>
						<CheckboxControl
							__nextHasNoMarginBottom
							label={ __(
								'Stack on Mobile',
								'ghostlabs-serendipity'
							) }
							help={ __(
								'Stack thumbnails on mobile?',
								'ghostlabs-serendipity'
							) }
							checked={ mobileStackThumbnails }
							onChange={ onMobileStackThumbnails }
						/>
					</Spacer>
				) : (
					''
				) }
				<Flex direction={ 'column' }>
					<Text>{ __( 'Layout', 'ghostlabs-serendipity' ) }</Text>
					{ isLayoutCurrent( {
						deviceType,
						layoutData,
						imageCount,
					} ) ? (
						<Button
							variant="secondary"
							onClick={ onRefreshLayout }
							style={ { justifyContent: 'center' } }
						>
							{ __( 'Refresh Layout', 'ghostlabs-serendipity' ) }
						</Button>
					) : (
						<Button
							variant="primary"
							onClick={ onSaveLayout }
							style={ { justifyContent: 'center' } }
						>
							{ sprintf(
								/* translators: %s: device type (Desktop, Tablet, Mobile) */
								__( 'Save %s Layout', 'ghostlabs-serendipity' ),
								deviceType
							) }
						</Button>
					) }
				</Flex>
				<Spacer marginTop={ 10 }>
					<CheckboxControl
						__nextHasNoMarginBottom
						label={ __( 'Debug', 'ghostlabs-serendipity' ) }
						help={ __(
							'Enable debug if encountering issues.',
							'ghostlabs-serendipity'
						) }
						checked={ debug }
						onChange={ onDebug }
					/>
				</Spacer>
			</PanelBody>
			<PanelBody
				title={ __( 'Lightbox Settings', 'ghostlabs-serendipity' ) }
				// Keyed off the stored value, which a refusal never writes: a block that holds
				// the carousel opens here so its notice is seen; a refusal does not reopen it.
				initialOpen={ lightboxValue === LIGHTBOX.BUILT_IN }
			>
				<Spacer marginTop={ 8 }>
					<RefusableSelect
						label={ __( 'Lightbox', 'ghostlabs-serendipity' ) }
						stored={ lightboxValue }
						options={ lightboxOptions }
						isLocked={ isLockedLightbox }
						copy={ ( notice ) =>
							lightboxRefusalCopy( {
								...notice,
								running: lightboxRunning( lightboxValue ),
							} )
						}
						// The help describes the mode in effect: a locked carousel renders as
						// "Your lightbox plugin", so explaining the carousel here would describe
						// something this site does not do.
						help={ ( value ) =>
							lightboxHelp( lightboxRunning( value ) )
						}
						onChange={ onLightbox }
					/>
				</Spacer>
				{ /*
				 * 🔴 Only where the carousel is granted. A free build holding `builtin` (a post
				 * from a licensed site, a lapsed license) once rendered every carousel control
				 * here, selling a feature the edition does not have and cannot render.
				 */ }
				{ lightboxValue === LIGHTBOX.BUILT_IN &&
					! isLockedLightbox( lightboxValue ) && (
						<>
							{ /*
							 * Image Resolution is the size the built-in carousel opens (owner,
							 * 2026-10-12). It sat in Layout Settings doing nothing: the render
							 * resolved it and never used it. Here, it shows only where it acts.
							 */ }
							<Spacer marginTop={ 6 }>
								<SelectControl
									label={ __(
										'Image Resolution',
										'ghostlabs-serendipity'
									) }
									help={ __(
										'The size each photograph opens at in the carousel.',
										'ghostlabs-serendipity'
									) }
									value={ imageResolution }
									options={ imageResolutions }
									onChange={ onImageResolution }
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
							</Spacer>
							<Spacer marginTop={ 6 }>
								<RadioControl
									label={ __(
										'Carousel Controls',
										'ghostlabs-serendipity'
									) }
									help={ __(
										'Choose which additional controls to display in the carousel.',
										'ghostlabs-serendipity'
									) }
									selected={ controls }
									options={ [
										{
											label: __(
												'Dot Navigation',
												'ghostlabs-serendipity'
											),
											value: 'dot-navigation',
										},
										{
											label: __(
												'Snap Display',
												'ghostlabs-serendipity'
											),
											value: 'snap-display',
										},
										{
											label: __(
												'None',
												'ghostlabs-serendipity'
											),
											value: 'none',
										},
									] }
									onChange={ onControls }
								/>
							</Spacer>
							<Spacer marginTop={ 3 }>
								<CheckboxControl
									__nextHasNoMarginBottom
									label={ __(
										'Show carousel captions',
										'ghostlabs-serendipity'
									) }
									help={ __(
										'Enable captions to be displayed on carousel',
										'ghostlabs-serendipity'
									) }
									checked={ showCarouselCaptions }
									onChange={ onShowCarouselCaptions }
								/>
							</Spacer>

							{ /*
							 * Autoplay only exists for the built-in carousel, which is
							 * licensed — so it needs no gate beyond the one the mode
							 * already carries. A free build cannot select the mode, and
							 * a block that claims it anyway is rewritten before render.
							 */ }
							<Spacer marginTop={ 3 }>
								<CheckboxControl
									__nextHasNoMarginBottom
									label={ __(
										'Play as a slideshow',
										'ghostlabs-serendipity'
									) }
									help={ __(
										'Advance on its own until the visitor takes over. Ignored for anyone who has asked for reduced motion.',
										'ghostlabs-serendipity'
									) }
									checked={ autoplay }
									onChange={ onAutoplay }
								/>
							</Spacer>

							{ autoplay && (
								<Spacer marginTop={ 3 }>
									<RangeControl
										__nextHasNoMarginBottom
										label={ __(
											'Seconds per slide',
											'ghostlabs-serendipity'
										) }
										value={ autoplayDelay }
										min={ 2 }
										max={ 15 }
										step={ 1 }
										onChange={ onAutoplayDelay }
									/>
								</Spacer>
							) }
						</>
					) }
			</PanelBody>
		</InspectorControls>
	);
};

export default GalleryInspectorControls;

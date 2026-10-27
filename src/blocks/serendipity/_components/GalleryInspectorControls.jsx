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
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalText as Text,
	Flex,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { hoverStyleInEffect, hoverStyleOptions } from '../_lib/stylesModel';
import {
	lightboxHelp,
	lightboxInEffect,
	lightboxModeFor,
	lightboxOptions,
} from '../_lib/lightboxModel';
import { FILTER } from '../_lib/editionHooks';
import { getLayout, isLayoutCurrent } from '../_lib/_blockUtils';

/**
 * The Hover Styles select every edition renders. An edition may replace it
 * (`FILTER.HOVER_STYLE_CONTROL`); it is handed the same props.
 *
 * @param {Object}   props
 * @param {string}   props.value    The style in effect.
 * @param {string}   props.stored   The block's own value.
 * @param {Function} props.onChange Writes a style to the block.
 * @param {Function} props.setAttributes Writes attributes, for a replacement that writes more.
 * @return {JSX.Element} The select.
 */
const HoverStyleSelect = ( { value, onChange } ) => (
	<SelectControl
		label={ __( 'Hover Styles', 'ghostlabs-serendipity' ) }
		value={ value }
		options={ hoverStyleOptions() }
		onChange={ onChange }
		__next40pxDefaultSize
		__nextHasNoMarginBottom
	/>
);

/**
 * The Lightbox select every edition renders. An edition may replace it
 * (`FILTER.LIGHTBOX_CONTROL`); it is handed the same props.
 *
 * @param {Object}   props
 * @param {string}   props.value    The mode in effect.
 * @param {string}   props.stored   The block's own value, resolved as `lightboxInEffect()` does.
 * @param {Function} props.onChange Writes a mode to the block.
 * @param {Function} props.setAttributes Writes attributes, for a replacement that writes more.
 * @return {JSX.Element} The select.
 */
const LightboxSelect = ( { value, onChange } ) => (
	<SelectControl
		label={ __( 'Lightbox', 'ghostlabs-serendipity' ) }
		value={ value }
		options={ lightboxOptions() }
		help={ lightboxHelp( value ) }
		onChange={ onChange }
		__next40pxDefaultSize
		__nextHasNoMarginBottom
	/>
);

/**
 * Inspector controls component for the Gallery block.
 *
 * ⚠️ Every control reads its value from the block's attributes, never from a copy of its
 * own. The copies this once kept were taken on mount and changed only by the controls
 * themselves, so undo reverted the block and left the sidebar showing what had been
 * undone.
 *
 * @param {Object}   props                         - Component properties
 * @param {Object}   props.attributes              - The block's attributes, for what an edition adds
 * @param {Function} props.setAttributes           - Writes attributes, for what an edition adds
 * @param {string}   props.lightbox                - Which lightbox a click opens
 * @param {Function} props.onLightbox              - Callback when the lightbox mode changes
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
 * @param {boolean}  props.debug
 * @param {string}   props.thumbnailSize           - The saved thumbnail size, what the control shows
 * @param {boolean}  props.mobileStackThumbnails
 * @param {Function} props.onMobileStackThumbnails
 * @param {Function} props.onDebug
 * @return {JSX.Element} Inspector controls panel
 */
const GalleryInspectorControls = ( {
	attributes,
	setAttributes,
	lightbox,
	onLightbox,
	debug,
	deviceType,
	gap,
	thumbnailSize,
	hoverStyle,
	layoutData,
	imageCount,
	minHeight,
	mobileStackThumbnails,
	onMobileStackThumbnails,
	onChangeGap,
	onChangeMinHeight,
	onSaveLayout,
	onRefreshLayout,
	onHoverStyle,
	onThumbnailSize,
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

	// From the attribute, not a constant: this used to start at 'medium' whatever the
	// block said, so a pattern inserted with 'large' showed Medium in the sidebar.
	const thumbnailSizeValue = thumbnailSize || 'medium';
	const lightboxValue = lightboxInEffect( attributes );
	const LightboxSettings = lightboxModeFor( lightboxValue )?.Settings;

	const HoverStyleControl = applyFilters(
		FILTER.HOVER_STYLE_CONTROL,
		HoverStyleSelect
	);
	const LightboxControl = applyFilters(
		FILTER.LIGHTBOX_CONTROL,
		LightboxSelect
	);

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
				<HoverStyleControl
					value={ hoverStyleInEffect( hoverStyle ) }
					stored={ hoverStyle }
					onChange={ onHoverStyle }
					setAttributes={ setAttributes }
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
				// A mode with settings of its own opens the panel, so they are seen.
				initialOpen={ Boolean( LightboxSettings ) }
			>
				<Spacer marginTop={ 8 }>
					<LightboxControl
						value={ lightboxValue }
						stored={ lightbox || lightboxValue }
						onChange={ onLightbox }
						setAttributes={ setAttributes }
					/>
				</Spacer>
				{ LightboxSettings && (
					<LightboxSettings
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				) }
			</PanelBody>
		</InspectorControls>
	);
};

export default GalleryInspectorControls;

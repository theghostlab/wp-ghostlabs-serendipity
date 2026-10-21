/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, ToolbarButton } from '@wordpress/components';
// Aliased: `gallery` is also the name of MediaUpload's boolean prop below.
import { gallery as galleryIcon } from '@wordpress/icons';

/**
 * Media Upload Control Component
 *
 * @param {Object}   props                - Component properties
 * @param {Array}    props.images         - Current selected images
 * @param {Function} props.onUpdateImages - Function to update images
 * @param {boolean}  props.toolbar
 */
const MediaUploadControl = ( {
	images = [],
	onUpdateImages,
	toolbar = false,
} ) => {
	const hasImages = images && images.length > 0;

	const onSelectImages = ( newImages ) => {
		// Map the image data to the format we need
		const mappedImages = newImages.map( ( image ) => {
			return {
				id: image.id,
				url: image.url,
				alt: image.alt,
				caption: image.caption?.raw || image.caption || '',
			};
		} );

		onUpdateImages( mappedImages );
	};

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ onSelectImages }
				allowedTypes={ [ 'image' ] }
				multiple
				gallery
				value={ images.map( ( img ) => img.id ) }
				render={ ( { open } ) =>
					toolbar ? (
						<ToolbarButton
							icon={ galleryIcon }
							label={
								hasImages
									? __(
											'Edit Gallery',
											'ghostlabs-serendipity'
									  )
									: __(
											'Add Images',
											'ghostlabs-serendipity'
									  )
							}
							onClick={ open }
						/>
					) : (
						<div className="media-upload-control">
							<Button
								onClick={ open }
								variant="primary"
								className="editor-media-placeholder__button"
								icon={ galleryIcon }
							>
								{ hasImages
									? __(
											'Edit Gallery',
											'ghostlabs-serendipity'
									  )
									: __(
											'Add Images',
											'ghostlabs-serendipity'
									  ) }
							</Button>
						</div>
					)
				}
			/>
		</MediaUploadCheck>
	);
};

export default MediaUploadControl;

import { Serendipity } from '../../../../dev/javascript/_lib/serendipity';
/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import { useEffect, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GalleryItem from './GalleryItem';
import { getAlignmentClass } from '../_lib/_utils';
import { resolveComposition } from '../_lib/composition';
import { tilePhotographName } from '../_lib/tileNames';

/**
 * Gallery grid component that displays images in a responsive layout.
 *
 * @param {Object}   props                       - Component properties
 * @param {string}   props.align                 - Alignment of the gallery
 * @param {string}   props.deviceType            - Current device type (mobile, tablet, desktop)
 * @param {string}   props.hoverStyle            - Style to apply on image hover
 * @param {Array}    props.images                - Array of image objects to display
 * @param {number}   props.gap                   - Gap between images in pixels
 * @param {Array}    props.layoutData            - Layout configuration for different device types
 * @param {number}   props.minHeight             - Minimum height of the gallery
 * @param {string}   props.parentBlockClientId   - Parent block client ID
 * @param {Object}   props.parentBlockAttributes - Parent block attributes
 * @param {Function} props.onRemoveImage         - Callback when image is removed
 * @param {Function} props.setGallery            - Callback to set gallery instance
 * @param {Function} props.setAspectRatio        - Callback to set gallery aspect ratio
 * @param {Object}   props.recompose             - The author's latest request: `{ count, mode, deviceType }`
 * @param {Function} props.onComposed            - Called with `{ gallery, aspectRatio, mode }` once a request is on the canvas
 * @return {JSX.Element|null} Gallery grid component or null if no images
 */
const GalleryGrid = ( {
	align,
	deviceType,
	hoverStyle,
	images,
	gap,
	layoutData,
	minHeight,
	parentBlockClientId,
	parentBlockAttributes,
	onRemoveImage,
	setGallery,
	setAspectRatio,
	recompose,
	onComposed,
} ) => {
	const galleryRef = useRef( null );

	// Which request has been carried out. A request is honored once, by the first
	// composition that completes after it — not by every later one a gap or height change
	// sets off, or a gallery refreshed an hour ago would refresh again on every nudge.
	const handled = useRef( recompose.count );

	// The composition lands on a timer, and whatever it reports back has to reach the
	// render that is current *then*, not the one that started it: the save reads
	// `layoutData`, and saving from a stale copy would undo anything changed meanwhile.
	const onComposedRef = useRef( onComposed );
	useEffect( () => {
		onComposedRef.current = onComposed;
	} );

	// Which photographs the tiles show, in order, the way a tile is keyed. ⚠️ The canvas once
	// composed only on the dependencies below and never on the photographs: a removed one left
	// a hole, and undoing the removal mounted a tile with no position, which filled the gallery
	// over the rest (owner, 2026-10-20). Not `images` itself: the library's details merged into
	// an entry replace the array, and recomposing on that would flash the gallery for nothing.
	const photographs = ( images || [] )
		.map( ( image ) => image.id || image.url )
		.join( '\n' );

	useEffect( () => {
		if ( ! galleryRef.current ) {
			return;
		}

		// ⚠️ The composition is deferred, so this effect can outlive its own component —
		// and in the inserter it routinely does. Pattern previews mount and unmount as
		// the list scrolls and as categories are switched, well inside 420ms. Without
		// the cancellation below, the timer fired against a detached ref, `Serendipity()`
		// returned undefined for a container it could not find items in, and reading
		// `.init` on that threw once per preview — enough to take the whole inserter
		// panel down. Nothing about that is visible in a passing test suite: the throw
		// lands in a `.catch( console.error )`.
		let canceled = false;

		// A request made at another breakpoint is dropped rather than carried over: a
		// refresh asked for at Desktop must not clear Tablet because the author switched
		// in the moment before it landed.
		const pending = recompose.count !== handled.current;
		const request =
			pending && recompose.deviceType === deviceType
				? recompose.mode
				: null;

		const initializeGallery = async () => {
			// The same resolution the front end uses, for the same reason: a gallery
			// with no composition saved at this breakpoint should borrow the nearest
			// one rather than compose a new one at random. It matters most in the
			// inserter, where a pattern would otherwise preview as a different
			// gallery every time it was opened. Only an author's refresh or reset
			// resolves differently — see `resolveComposition()`.
			const { layout, borrowed } = resolveComposition(
				layoutData,
				deviceType,
				images.length,
				request
			);

			// Re-read the ref rather than trusting the one this effect closed over: the
			// timer has already waited, and the node may have gone in the meantime.
			const gallery = galleryRef.current
				? Serendipity( galleryRef.current, { gap } )
				: null;

			// `Serendipity()` answers undefined for a container with no items in it —
			// an unmounted preview, or a gallery whose images have not been rendered
			// yet. That is a reason to stop, not a reason to throw.
			if ( ! gallery ) {
				return null;
			}

			await gallery.init(
				! borrowed && layout?.minHeight ? layout.minHeight : minHeight,
				layout?.rectangles || null
			);
			return gallery;
		};

		let resizing = null;

		const timer = setTimeout( () => {
			initializeGallery()
				.then( ( gallery ) => {
					if ( canceled || ! gallery ) {
						return null;
					}

					setGallery( gallery );

					// ⚠️ The canvas changes width without the window doing so — the
					// settings sidebar opening is the everyday case. The front end
					// re-lays a gallery out when its page resizes; without this the
					// editor kept the old width, the last tile ran under the sidebar,
					// and anything drawn over the gallery missed the tiles. The
					// observer comes from the canvas's realm, which is the one that
					// resizes, and only a change of width re-lays anything out.
					const container = gallery.galleryContainer;
					const view = container.ownerDocument.defaultView;
					let width = container.clientWidth;
					let frame = null;

					resizing = new view.ResizeObserver( () => {
						if ( container.clientWidth === width ) {
							return;
						}

						width = container.clientWidth;
						view.cancelAnimationFrame( frame );
						frame = view.requestAnimationFrame( () =>
							gallery.handleResize()
						);
					} );
					resizing.observe( container );

					const dimensions =
						gallery.galleryContainer.getBoundingClientRect();
					const aspectRatio = `${ dimensions.width } / ${ dimensions.height }`;

					setAspectRatio( aspectRatio );

					if ( pending ) {
						handled.current = recompose.count;
					}

					// The instance that was just composed, not the `gallery` state: that
					// is set above but not yet rendered, and saving from the previous
					// instance is exactly how the old composition got written back.
					if ( request ) {
						onComposedRef.current( {
							gallery,
							aspectRatio,
							mode: request,
						} );
					}
				} )
				// eslint-disable-next-line no-console
				.catch( console.error );
		}, 420 );

		return () => {
			canceled = true;
			clearTimeout( timer );
			resizing?.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		recompose.count,
		photographs,
		deviceType,
		align,
		gap,
		minHeight,
		parentBlockClientId,
		parentBlockAttributes?.align,
	] );

	// Where focus goes once a tile removed by keyboard has left the canvas.
	const focusAfterRemoval = useRef( null );

	/**
	 * A tile's Remove, pressed.
	 *
	 * ⚠️ A keyboard press used to leave focus on the canvas's <body>: the tile went, with focus
	 * inside it, and the author started again from the top (accessibility re-run, 2026-10-18).
	 * Focus moves to the tile that takes the removed one's place, or the one before when it was
	 * the last, or the block when none is left. A pointer press moves nothing: the button never
	 * took focus, and focusing a tile scrolls it into view under a still pointer.
	 *
	 * @param {Object}  image    The `rawImages` entry.
	 * @param {number}  index    Its tile.
	 * @param {boolean} hadFocus Whether the button had focus when it was pressed.
	 */
	const removeImage = ( image, index, hadFocus ) => {
		const name = tilePhotographName( {
			alt: image.alt,
			caption: image.caption,
			src: image.url,
		} );

		speak(
			name
				? sprintf(
						/* translators: %s: the photograph's alt text, caption or file name. */
						__( 'Removed %s.', 'ghostlabs-serendipity' ),
						name
					)
				: __( 'Image removed.', 'ghostlabs-serendipity' )
		);

		if ( ! hadFocus ) {
			onRemoveImage( image );
			return;
		}

		if ( images.length === 1 ) {
			// No tile is left to take focus, and this component is about to render nothing.
			const block = galleryRef.current?.closest( '[data-block]' );

			onRemoveImage( image );
			block?.focus();
			return;
		}

		focusAfterRemoval.current = index;
		onRemoveImage( image );
	};

	useEffect( () => {
		const index = focusAfterRemoval.current;

		if ( index === null ) {
			return;
		}

		focusAfterRemoval.current = null;

		// By position, after the render: tiles are keyed by attachment id, else by index, so
		// the node that held the next photograph before the render may not hold it after.
		const tiles =
			galleryRef.current?.querySelectorAll( ':scope > li' ) ?? [];

		tiles[ Math.min( index, tiles.length - 1 ) ]?.focus();
	}, [ images ] );

	if ( ! images || images.length === 0 ) {
		return null;
	}

	return (
		<ul
			className={ `ghostlabs-serendipity${ getAlignmentClass( align ) }` }
			ref={ galleryRef }
		>
			{ images.map( ( image, index ) => (
				<GalleryItem
					key={ `gallery-item-${ image.id || index }` }
					index={ index }
					image={ image }
					hoverStyle={ hoverStyle }
					onRemove={ removeImage }
				/>
			) ) }
		</ul>
	);
};

export default GalleryGrid;

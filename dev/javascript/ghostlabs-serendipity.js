import { Serendipity } from './_lib/serendipity';
import { resolveLayout } from './_lib/layoutResolution';
import { loadEnhancement } from './_lib/enhancement';

/**
 * The gallery. Every edition ships this: the mosaic layout, the resize
 * handling, and a click that follows the anchor the render already emitted.
 *
 * A lightbox an edition adds of its own is not here and must not be: a free build
 * carries no part of it. Instead this file *offers a seat*. An enhancement bundle
 * assigns `window.GhostLabsSerendipity.galleryClickHandler`, and the delegating
 * handler below picks it up.
 *
 * The lookup happens at click time, not at bind time, so neither bundle has to load
 * before the other. With nothing registered, a click follows the link — which is
 * exactly the lightbox-agnostic behavior a third-party lightbox hooks into.
 */
window.GhostLabsSerendipity = window.GhostLabsSerendipity || {};

const getA11yString = ( key, fallback ) =>
	window.ghostlabsSerendipityA11y?.[ key ] ?? fallback;

const ghostLabsSerendipity = () => {
	const galleryItems = document.querySelectorAll( '.ghostlabs-serendipity' );

	if ( ! galleryItems.length ) {
		return null;
	}

	const getDeviceType = () => {
		const width = window.innerWidth;
		if ( width <= 440 ) {
			return 'Mobile';
		} // 360px
		if ( width <= 780 ) {
			return 'Tablet';
		} // 780px
		return 'Desktop';
	};

	const intersectionObserver = ( items ) => {
		const observer = new window.IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( entry.isIntersecting ) {
						// 🎯 USE ENHANCED FUNCTION WITH PRELOADER
						const {
							aspectRatio,
							debug,
							deviceType,
							gap,
							minHeight,
							rectangles,
						} = collectArgs( entry.target );

						if (
							deviceType === 'Mobile' &&
							entry.target.classList.contains(
								'ghostlabs-serendipity--stack-on-mobile'
							)
						) {
							observer.unobserve( entry.target );
							return;
						}

						const gallery = Serendipity( entry.target, {
							gap,
							debug,
						} );

						gallery.init( minHeight, rectangles, aspectRatio );

						const state = {
							currentDeviceType: deviceType,
							gallery,
						};

						resizeObserver( entry.target, state );

						observer.unobserve( entry.target );
					}
				} );
			},
			{
				threshold: 0.01,
				// rootMargin: '-50px',
				rootMargin: '0px',
			}
		);

		items.forEach( ( gallery ) => {
			observer.observe( gallery );
		} );
	};

	const handleResize = ( galleryItem, state ) => {
		const { aspectRatio, deviceType, gap, minHeight, rectangles } =
			collectArgs( galleryItem );

		if (
			deviceType === 'Mobile' &&
			galleryItem.classList.contains(
				'ghostlabs-serendipity--stack-on-mobile'
			)
		) {
			if ( state.gallery ) {
				state.gallery.destroy();
				state.gallery = null;
			}
			return;
		}

		if ( ! state.gallery || ! state.gallery.isInitialized() ) {
			state.gallery = Serendipity( galleryItem, { gap } );
			state.gallery.init( minHeight, rectangles, aspectRatio );
		}

		let setMinHeight = minHeight;

		if ( state.gallery.getLayoutData() ) {
			const { originalDimensions } = state.gallery.getLayoutData();

			if ( window.innerWidth < originalDimensions.width ) {
				setMinHeight = `${ window.innerWidth * 0.35 }px`;
			}

			galleryItem.style.minHeight = setMinHeight;
		}

		if ( state.currentDeviceType !== deviceType ) {
			state.gallery.init( setMinHeight, rectangles, aspectRatio );
			state.currentDeviceType = deviceType;
		}

		state.gallery.handleResize();
	};

	const resizeObserver = ( galleryItem, state ) => {
		let resizeTimer;

		const observer = new ResizeObserver( () => {
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( () => {
				handleResize( galleryItem, state );
			}, 480 );
		} );

		observer.observe( window.document.body );
	};

	const collectArgs = ( target ) => {
		const { gap, minHeight, debug } = target.dataset;

		// Only an entry the store owns: an id can still name something every object
		// inherits (re-audit, 2026-10-17, S1).
		const store = window.GhostLabsSerendipityGallery || {};
		const layoutData =
			( Object.prototype.hasOwnProperty.call( store, target.id ) &&
				store[ target.id ]?.layoutData ) ||
			[];

		const deviceType = getDeviceType();

		// One <li> per image, so the DOM is the authority on how many tiles a saved
		// layout has to describe. See layoutResolution for what happens when it
		// describes a different number, or none at this breakpoint at all.
		const itemCount = target.querySelectorAll(
			':scope > .ghostlabs-serendipity__gallery-item'
		).length;

		const { layout, borrowed } = resolveLayout(
			layoutData,
			deviceType,
			itemCount
		);

		return {
			aspectRatio: layout?.aspectRatio || 'auto',
			debug: debug === '1',
			deviceType,
			gap,
			// A borrowed layout brings its geometry but not its height. Percentages
			// scale to whatever box they are given; a Desktop min-height does not,
			// and would leave a phone scrolling through a 720px-tall gallery.
			minHeight:
				! borrowed && layout?.minHeight ? layout.minHeight : minHeight,
			rectangles: layout?.rectangles || null,
		};
	};
	/**
	 * One handler per gallery, resolved on every click.
	 *
	 * If an enhancement has registered itself, it gets the event and decides what to
	 * do. Reading the global here rather than at bind time is what removes the
	 * load-order dependency between the two bundles.
	 *
	 * With nothing registered, a mouse click is **left alone entirely**. It used to be
	 * followed with `window.open( link.href, '_self' )`, on the reasoning that following
	 * the link is the lightbox-agnostic behavior — and that reasoning is wrong. Every
	 * third-party lightbox works by listening for the click and calling
	 * `preventDefault()`; navigating ourselves means leaving the page before it can, so
	 * the anchor and the `data-rel` grouping the render emits for exactly this purpose
	 * were being thrown away by the bundle that emitted them. Doing nothing is what
	 * "agnostic" actually requires: the browser follows the link if nobody wants it.
	 *
	 * There is no keyboard path of its own any more. The tile is a list item, and the
	 * thing inside it that opens the image is a link or a real <button>; Enter and
	 * Space on those produce a click natively, which lands here like any other — and
	 * a third-party lightbox listening for clicks hears it too. The tile used to be a
	 * role="button" with scripted keys, which took its list-item role away.
	 *
	 * One mouse case is scripted: a click inside the tile that did not land on its
	 * trigger. The Card Flip hover style turns the tile over on hover, so by the time
	 * the pointer clicks it is over the caption face and not the link, and nothing
	 * opened — in any lightbox mode but the built-in one, whose handler takes the
	 * whole tile. That click is forwarded to the trigger with `click()`, which a
	 * third-party lightbox hears like any other and, failing one, follows the link.
	 * A click that did land on the trigger is left entirely alone, as before.
	 *
	 * @param {Element} gallery The gallery element the handler is bound to.
	 * @param {Event}   e       The click event.
	 */
	const _handleGalleryEvent = ( gallery, e ) => {
		const enhanced = window.GhostLabsSerendipity?.galleryClickHandler;

		if ( typeof enhanced === 'function' ) {
			enhanced( gallery, e );
			return;
		}

		// The enhancement exists but has not been fetched yet: this click is the one
		// that fetches it. Only for a gallery the render resolved to the mode the seat
		// serves — any other gallery has nothing waiting for it and keeps the behavior below.
		// The event object survives the wait: the handler reads its target, and the
		// tile has no default action left to prevent once the browser has moved on.
		const seat = window.GhostLabsSerendipity?.enhancement;

		if (
			seat?.script &&
			seat.lightbox &&
			gallery.dataset.lightbox === seat.lightbox
		) {
			e.preventDefault();

			loadEnhancement( seat ).then( () => {
				const handler =
					window.GhostLabsSerendipity?.galleryClickHandler;

				if ( typeof handler === 'function' ) {
					handler( gallery, e );
				}
			} );

			return;
		}

		_forwardToTrigger( e );
	};

	/**
	 * Hand a click that landed beside a tile's trigger to the trigger itself.
	 *
	 * @param {Event} e The click event.
	 */
	const _forwardToTrigger = ( e ) => {
		const tile = e.target.closest( '.ghostlabs-serendipity__gallery-item' );

		if (
			! tile ||
			e.target.closest( 'a, .ghostlabs-serendipity__trigger' ) ||
			e.defaultPrevented
		) {
			return;
		}

		const trigger = tile.querySelector(
			'a, .ghostlabs-serendipity__trigger'
		);

		if ( trigger ) {
			e.preventDefault();
			trigger.click();
		}
	};

	const bindGalleryEvents = ( galleries ) => {
		galleries.forEach( ( gallery ) => {
			gallery.addEventListener(
				'click',
				_handleGalleryEvent.bind( null, gallery )
			);
		} );
	};

	const init = () => {
		intersectionObserver( galleryItems );
		bindGalleryEvents( galleryItems );
	};

	return {
		init,
	};
};

// Exposed so an enhancement can reuse it rather than re-deriving the string table.
window.GhostLabsSerendipity.getA11yString = getA11yString;

document.addEventListener( 'DOMContentLoaded', () => {
	const ghostLabsSerendipityObject = ghostLabsSerendipity();

	if ( ghostLabsSerendipityObject?.init ) {
		ghostLabsSerendipityObject.init();
	}
} );

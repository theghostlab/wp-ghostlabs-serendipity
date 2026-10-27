/* eslint-disable no-console */
import { splitValueAndUnit } from '../_utils/tools';
import {
	GALLERY_ITEM_SELECTOR,
	GALLERY_LOADING_CLASS,
	GALLERY_LOADED_CLASS,
} from './constants';
import { insetTiles, toCells } from './gutters';

const SerendipityPreloader = ( galleryContainer, debug = false ) => {
	const activePreloaders = new Set();

	/**
	 * Whether the gallery's inline min-height is this preloader's placeholder, and so its to
	 * remove. ⚠️ It once removed any inline `400px`, whoever had set it: a gallery whose author
	 * chose 400px lost its height 300ms after loading and, its tiles all positioned absolutely,
	 * ended with none at all (2026-10-20).
	 */
	let placeholder = false;

	/**
	 * Start preloader for a gallery
	 */
	const startPreloader = () => {
		if ( ! galleryContainer ) {
			return;
		}

		galleryContainer.classList.add( GALLERY_LOADING_CLASS );
		galleryContainer.classList.remove( GALLERY_LOADED_CLASS );
		activePreloaders.add( galleryContainer );

		// Set minimum height based on container or default
		const computedHeight =
			galleryContainer.style.height ||
			getComputedStyle( galleryContainer ).height;

		if ( ! computedHeight || computedHeight === 'auto' ) {
			galleryContainer.style.minHeight = '400px';
			placeholder = true;
		}

		if ( debug ) {
			console.log( '🔄 Preloader started for gallery' );
		}
	};

	/**
	 * End preloader for a gallery
	 */
	const endPreloader = () => {
		if ( ! galleryContainer ) {
			return;
		}

		galleryContainer.classList.remove( GALLERY_LOADING_CLASS );
		galleryContainer.classList.add( GALLERY_LOADED_CLASS );
		activePreloaders.delete( galleryContainer );

		// Remove the placeholder after loading, if it is still ours.
		setTimeout( () => {
			if ( placeholder && galleryContainer.style.minHeight === '400px' ) {
				galleryContainer.style.minHeight = '';
			}

			placeholder = false;
		}, 300 ); // Match CSS transition duration

		if ( debug ) {
			console.log( '✅ Preloader ended for gallery' );
		}
	};

	/**
	 * Wait for all images in gallery to load
	 * @param {Element} container
	 */
	const waitForImages = async ( container ) => {
		if ( ! container ) {
			return Promise.resolve();
		}

		const images = container.querySelectorAll( 'img' );
		const imagePromises = Array.from( images ).map( ( img ) => {
			return new Promise( ( resolve ) => {
				if ( img.complete && img.naturalHeight > 0 ) {
					// Image already loaded
					resolve();
				} else {
					// Wait for image to load
					const onLoad = () => {
						img.removeEventListener( 'load', onLoad );
						img.removeEventListener( 'error', onLoad );
						resolve();
					};
					img.addEventListener( 'load', onLoad );
					img.addEventListener( 'error', onLoad );
				}
			} );
		} );

		return Promise.all( imagePromises );
	};

	/**
	 * Wait for critical images (first few) to load for faster perceived loading
	 * @param {Element} container
	 * @param {number}  count
	 */
	const waitForCriticalImages = async ( container, count = 3 ) => {
		if ( ! container ) {
			return Promise.resolve();
		}

		const images = container.querySelectorAll( 'img' );
		const criticalImages = Array.from( images ).slice( 0, count );

		const imagePromises = criticalImages.map( ( img ) => {
			return new Promise( ( resolve ) => {
				if ( img.complete && img.naturalHeight > 0 ) {
					resolve();
				} else {
					const onLoad = () => {
						img.removeEventListener( 'load', onLoad );
						img.removeEventListener( 'error', onLoad );
						resolve();
					};
					img.addEventListener( 'load', onLoad );
					img.addEventListener( 'error', onLoad );

					// Timeout after 3 seconds to prevent hanging
					setTimeout( resolve, 3000 );
				}
			} );
		} );

		return Promise.all( imagePromises );
	};

	/**
	 * Get loading strategy based on gallery size
	 * @param {Element} container
	 */
	const getLoadingStrategy = ( container ) => {
		const imageCount = container.querySelectorAll( 'img' ).length;

		if ( imageCount <= 6 ) {
			return 'wait-all'; // Wait for all images in small galleries
		} else if ( imageCount <= 12 ) {
			return 'wait-critical'; // Wait for first few in medium galleries
		}
		return 'immediate'; // Show immediately for large galleries
	};

	/**
	 * Handle loading based on strategy
	 * @param {Element} container
	 */
	const handleLoading = async ( container ) => {
		if ( ! container ) {
			return;
		}

		const strategy = getLoadingStrategy( container );

		switch ( strategy ) {
			case 'wait-all':
				await waitForImages( container );
				break;
			case 'wait-critical':
				await waitForCriticalImages( container, 4 );
				break;
			case 'immediate':
				// Add small delay to allow layout calculation
				await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );
				break;
		}
	};

	/**
	 * The layout has given the gallery a height of its own, which may be the same 400px.
	 */
	const releasePlaceholder = () => {
		placeholder = false;
	};

	return {
		handleLoading,
		startPreloader,
		endPreloader,
		releasePlaceholder,
	};
};

/**
 * Convert pixel-based rectangles to percentage-based rectangles
 * This makes layouts responsive and scalable
 * @param {Array}  rectangles
 * @param {number} containerWidth
 * @param {number} containerHeight
 */
const convertToPercentages = (
	rectangles,
	containerWidth,
	containerHeight
) => {
	return rectangles.map( ( rect ) => ( {
		// Store both pixel and percentage values
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height,

		// Percentage values for responsive scaling
		xPercent: ( rect.x / containerWidth ) * 100,
		yPercent: ( rect.y / containerHeight ) * 100,
		widthPercent: ( rect.width / containerWidth ) * 100,
		heightPercent: ( rect.height / containerHeight ) * 100,
	} ) );
};

/**
 * Place a percentage layout in a container of this size, at this gap.
 *
 * ⚠️ The gutter is painted here, never read from the layout: the rectangles are closed
 * into cells first (`toCells`), so a layout saved with its gutters baked in — every
 * layout saved before 2026-10-13 — paints at the gallery's Gap Size like any other.
 * `Service\Gutters` paints the first frame the same way, and the two must agree.
 *
 * @param {Array}  rectangles
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @param {number} gap             The gutter, in pixels.
 */
const convertToPixels = (
	rectangles,
	containerWidth,
	containerHeight,
	gap = 0
) => {
	const cells = toCells( rectangles ).map( ( rect ) => ( {
		x: ( rect.xPercent / 100 ) * containerWidth,
		y: ( rect.yPercent / 100 ) * containerHeight,
		width: ( rect.widthPercent / 100 ) * containerWidth,
		height: ( rect.heightPercent / 100 ) * containerHeight,
	} ) );

	return insetTiles( cells, containerWidth, containerHeight, gap );
};

const calculateContainerWidth = ( galleryContainer ) => {
	if ( ! galleryContainer ) {
		return window.innerWidth;
	}

	const [ parentInlinePaddingValue ] = splitValueAndUnit(
		window.getComputedStyle( galleryContainer.parentNode ).paddingInline
	);

	return galleryContainer.offsetWidth > window.innerWidth
		? window.innerWidth - parentInlinePaddingValue * 2
		: galleryContainer.offsetWidth;
};

/**
 * Enhanced Serendipity with responsive saved layouts
 *
 * @param {Element}  galleryContainer
 * @param {Object}   options
 * @param {string}   options.gap
 * @param {boolean}  options.debug
 * @param {Function} options.paintTile `( item, rectangle )`, after each tile is placed: the tile,
 *                                     and its saved rectangle where there is one. What an edition
 *                                     draws on a tile from what it saved there; nothing by default.
 */
export const Serendipity = (
	galleryContainer,
	options = { gap: '2px', debug: false }
) => {
	if ( ! galleryContainer ) {
		return;
	}

	const GAP = splitValueAndUnit( options.gap )[ 0 ] ?? 2;
	const MIN_HEIGHT = '720px';
	const DEBUG = options.debug;
	const paintTile =
		typeof options.paintTile === 'function' ? options.paintTile : null;

	// Store the original container dimensions when layout was first calculated
	let originalDimensions = null;
	let savedPercentageLayout = null;

	const preloader = SerendipityPreloader( galleryContainer );
	preloader.startPreloader();

	if ( ! galleryContainer ) {
		preloader.endPreloader();
		return;
	}

	const items = Array.from(
		galleryContainer.querySelectorAll( GALLERY_ITEM_SELECTOR )
	);
	const totalItems = items.length;

	if ( totalItems === 0 ) {
		preloader.endPreloader();
		return;
	}

	/**
	 * Enhanced applyImprovedLayout with percentage conversion
	 * @param {string}     minHeight
	 * @param {Array|null} defaultRectangles
	 * @param {string}     aspectRatio
	 */
	const applyImprovedLayout = (
		minHeight,
		defaultRectangles = null,
		aspectRatio = 'auto'
	) => {
		galleryContainer.style.display = 'block';
		galleryContainer.style.aspectRatio = aspectRatio;

		if ( ! galleryContainer.style.minHeight ) {
			galleryContainer.style.minHeight = MIN_HEIGHT;
		}

		if ( minHeight?.length > 0 && minHeight !== 'auto' ) {
			galleryContainer.style.minHeight = minHeight;
		}

		preloader.releasePlaceholder();

		// Reset all items for absolute positioning
		items.forEach( ( item ) => {
			item.style.gridColumn = '';
			item.style.gridRow = '';
			item.style.position = 'absolute';
			item.style.margin = '0';
			item.style.boxSizing = 'border-box';

			const link = item.querySelector( 'a' );
			if ( link ) {
				link.style.display = 'block';
				link.style.width = '100%';
				link.style.height = '100%';
			}

			const img = item.querySelector( 'img' );
			if ( img ) {
				img.style.width = '100%';
				img.style.height = '100%';
				img.style.objectFit = 'cover';
				img.style.display = 'block';
			}
		} );

		// const containerWidth = galleryContainer.offsetWidth > window.innerWidth ? (window.innerWidth - 120) : galleryContainer.offsetWidth;
		const containerWidth = calculateContainerWidth( galleryContainer );
		const containerHeight = galleryContainer.offsetHeight;

		let rectangles = [];

		if ( defaultRectangles?.length > 0 ) {
			// 🎯 CHECK IF RECTANGLES ARE IN PERCENTAGE FORMAT
			const hasPercentages =
				defaultRectangles[ 0 ]?.xPercent !== undefined;

			if ( hasPercentages ) {
				// Convert percentage-based saved layout to current pixel dimensions
				rectangles = convertToPixels(
					defaultRectangles,
					containerWidth,
					containerHeight,
					GAP
				);

				if ( DEBUG ) {
					console.log(
						'📐 Applied saved layout with responsive scaling'
					);
				}
			} else {
				// Legacy pixel-based rectangles - use as-is (non-responsive)
				rectangles = defaultRectangles;

				if ( DEBUG ) {
					console.log(
						'⚠️ Using pixel-based layout (non-responsive)'
					);
				}
			}

			// Store the saved percentage layout for future resizes
			if ( hasPercentages ) {
				savedPercentageLayout = defaultRectangles;
				originalDimensions = {
					width: containerWidth,
					height: containerHeight,
				};
			}
		} else {
			// Generate new layout
			const weights = generateRandomizedWeights( totalItems );

			// Composed edge to edge and saved that way; the gap is painted on top, the
			// same as for a saved layout, so what the author sees is what gets saved.
			savedPercentageLayout = convertToPercentages(
				balancedTreemap( weights, containerWidth, containerHeight, 0 ),
				containerWidth,
				containerHeight
			);
			rectangles = convertToPixels(
				savedPercentageLayout,
				containerWidth,
				containerHeight,
				GAP
			);
			originalDimensions = {
				width: containerWidth,
				height: containerHeight,
			};

			if ( DEBUG ) {
				console.log( '✨ Generated new responsive layout' );
			}
		}

		// Apply calculated positions to items
		rectangles.forEach( ( rect, i ) => {
			if ( i < items.length ) {
				const item = items[ i ];
				item.style.left = rect.x + 'px';
				item.style.top = rect.y + 'px';
				item.style.width = rect.width + 'px';
				item.style.height = rect.height + 'px';
				paintTile?.( item, savedPercentageLayout?.[ i ] );
			}
		} );

		return rectangles;
	};

	/**
	 * Handle resize - reapply saved layout responsively
	 */
	const handleResize = () => {
		if ( ! savedPercentageLayout ) {
			return;
		}

		// const containerWidth = galleryContainer.offsetWidth;
		const containerWidth = calculateContainerWidth( galleryContainer );
		const containerHeight = galleryContainer.offsetHeight;

		// Convert saved percentages to new pixel values
		const scaledRectangles = convertToPixels(
			savedPercentageLayout,
			containerWidth,
			containerHeight,
			GAP
		);

		// Apply scaled positions
		scaledRectangles.forEach( ( rect, i ) => {
			if ( i < items.length ) {
				const item = items[ i ];
				item.style.left = rect.x + 'px';
				item.style.top = rect.y + 'px';
				item.style.width = rect.width + 'px';
				item.style.height = rect.height + 'px';
			}
		} );

		if ( DEBUG ) {
			console.log(
				'🔄 Layout scaled to new dimensions:',
				{
					from: originalDimensions,
					to: { width: containerWidth, height: containerHeight },
				},
				galleryContainer
			);
		}
	};

	/**
	 * Get layout data for saving (in percentage format)
	 */
	const getLayoutData = () => {
		if ( ! savedPercentageLayout ) {
			if ( DEBUG ) {
				console.warn( 'No layout data available yet' );
			}
			return null;
		}

		return {
			rectangles: savedPercentageLayout,
			originalDimensions,
			format: 'percentage',
			timestamp: new Date().toISOString(),
			totalItems,
		};
	};

	/**
	 * Load saved layout data
	 * @param {Object} layoutData
	 */
	const loadLayoutData = ( layoutData ) => {
		if ( ! layoutData || ! layoutData.rectangles ) {
			if ( DEBUG ) {
				console.error( 'Invalid layout data' );
			}

			return false;
		}

		// Check format
		const hasPercentages =
			layoutData.rectangles[ 0 ]?.xPercent !== undefined;

		if ( hasPercentages ) {
			savedPercentageLayout = layoutData.rectangles;
			originalDimensions = layoutData.originalDimensions;

			if ( DEBUG ) {
				console.log( '✅ Loaded percentage-based layout data' );
			}

			return true;
		}
		// Convert old pixel-based data to percentages if original dimensions available
		if ( layoutData.originalDimensions ) {
			savedPercentageLayout = convertToPercentages(
				layoutData.rectangles,
				layoutData.originalDimensions.width,
				layoutData.originalDimensions.height
			);
			originalDimensions = layoutData.originalDimensions;

			if ( DEBUG ) {
				console.log( '✅ Converted legacy pixel data to percentages' );
			}

			return true;
		}
		if ( DEBUG ) {
			console.warn(
				'⚠️ Cannot convert legacy data without original dimensions'
			);
		}

		return false;
	};

	// Your existing helper functions (unchanged)
	const generateRandomizedWeights = ( count ) => {
		const weights = [];
		if ( count <= 6 ) {
			for ( let i = 0; i < count; i++ ) {
				weights.push( 0.8 + Math.random() * 0.4 );
			}
		} else {
			const featureCount = Math.min( Math.floor( count / 3 ), 3 );
			for ( let i = 0; i < count; i++ ) {
				if ( i < featureCount ) {
					weights.push( 1.5 + Math.random() * 0.5 );
				} else {
					weights.push( 0.7 + Math.random() * 0.6 );
				}
			}
		}
		return shuffleArray( weights );
	};

	const shuffleArray = ( array ) => {
		const result = [ ...array ];
		for ( let i = result.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
		}
		return result;
	};

	const balancedTreemap = ( data, width, height, padding = 0 ) => {
		const total = data.reduce( ( sum, value ) => sum + value, 0 );
		const normalizedData = data.map( ( value ) => value / total );
		const totalArea = width * height;
		const areas = normalizedData.map( ( value ) => value * totalArea );
		return binaryPartition( areas, { x: 0, y: 0, width, height }, padding );
	};

	const binaryPartition = ( areas, container, padding ) => {
		if ( areas.length === 0 ) {
			return [];
		}
		if ( areas.length === 1 ) {
			return [
				{
					x: container.x + padding,
					y: container.y + padding,
					width: container.width - padding * 2,
					height: container.height - padding * 2,
				},
			];
		}

		const sortedAreas = [ ...areas ].sort( ( a, b ) => b - a );
		const splitHorizontally = container.width > container.height;
		const totalArea = sortedAreas.reduce( ( sum, area ) => sum + area, 0 );
		let currentSum = 0;
		let splitIndex = 0;
		const targetRatio = 0.4 + Math.random() * 0.2;

		for ( let i = 0; i < sortedAreas.length; i++ ) {
			currentSum += sortedAreas[ i ];
			const ratio = currentSum / totalArea;
			if ( ratio >= targetRatio ) {
				splitIndex = i + 1;
				break;
			}
		}

		splitIndex = Math.max( 1, Math.min( splitIndex, areas.length - 1 ) );
		const firstGroup = sortedAreas.slice( 0, splitIndex );
		const secondGroup = sortedAreas.slice( splitIndex );
		const firstGroupArea = firstGroup.reduce(
			( sum, area ) => sum + area,
			0
		);
		const secondGroupArea = secondGroup.reduce(
			( sum, area ) => sum + area,
			0
		);
		const firstGroupRatio =
			firstGroupArea / ( firstGroupArea + secondGroupArea );

		let firstContainer, secondContainer;
		if ( splitHorizontally ) {
			const splitWidth = container.width * firstGroupRatio;
			firstContainer = {
				x: container.x,
				y: container.y,
				width: splitWidth - padding / 2,
				height: container.height,
			};
			secondContainer = {
				x: container.x + splitWidth + padding / 2,
				y: container.y,
				width: container.width - splitWidth - padding,
				height: container.height,
			};
		} else {
			const splitHeight = container.height * firstGroupRatio;
			firstContainer = {
				x: container.x,
				y: container.y,
				width: container.width,
				height: splitHeight - padding / 2,
			};
			secondContainer = {
				x: container.x,
				y: container.y + splitHeight + padding / 2,
				width: container.width,
				height: container.height - splitHeight - padding,
			};
		}

		return [
			...binaryPartition( firstGroup, firstContainer, padding ),
			...binaryPartition( secondGroup, secondContainer, padding ),
		];
	};

	const init = async (
		minHeight,
		defaultRectangles = null,
		aspectRatio = 'auto'
	) => {
		await preloader.handleLoading();
		preloader.startPreloader();

		const rectangles = applyImprovedLayout(
			minHeight,
			defaultRectangles,
			aspectRatio
		);

		// 🎯 DISPATCH EVENT WITH PERCENTAGE-BASED DATA
		const layoutEvent = new CustomEvent( 'serendipityLayoutCalculated', {
			detail: {
				galleryId: galleryContainer.parentNode.dataset.galleryId,
				rectangles: savedPercentageLayout || rectangles, // Send percentage data
				pixelRectangles: rectangles, // Also include pixel data for reference
				originalDimensions,
				format: 'percentage',
				element: galleryContainer,
			},
		} );
		document.dispatchEvent( layoutEvent );

		requestAnimationFrame( () => {
			requestAnimationFrame( () => {
				preloader.endPreloader( galleryContainer );
			} );
		} );
	};

	/**
	 * Remove all custom styling and attributes
	 */
	const destroy = () => {
		// Remove container styles
		galleryContainer.style.removeProperty( 'display' );
		galleryContainer.style.removeProperty( 'aspect-ratio' );
		galleryContainer.style.removeProperty( 'min-height' );

		// Remove preloader classes
		galleryContainer.classList.remove( GALLERY_LOADING_CLASS );
		galleryContainer.classList.remove( GALLERY_LOADED_CLASS );

		// Reset items
		items.forEach( ( item ) => {
			item.removeAttribute( 'style' );

			const link = item.querySelector( 'a' );
			if ( link ) {
				link.removeAttribute( 'style' );
			}

			const img = item.querySelector( 'img' );
			if ( img ) {
				img.removeAttribute( 'style' );
			}
		} );

		if ( DEBUG ) {
			console.log( '🗑️ Serendipity instance destroyed' );
		}
	};

	const isInitialized = () => {
		return galleryContainer.classList.contains( GALLERY_LOADED_CLASS );
	};

	return {
		galleryContainer,
		isInitialized,
		destroy,
		init,
		applyImprovedLayout,
		handleResize,
		getLayoutData,
		loadLayoutData,
		convertToPercentages: ( rects ) =>
			convertToPercentages(
				rects,
				originalDimensions.width,
				originalDimensions.height
			),
		convertToPixels: ( rects ) =>
			convertToPixels(
				rects,
				galleryContainer.offsetWidth,
				galleryContainer.offsetHeight,
				GAP
			),
	};
};

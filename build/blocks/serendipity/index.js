/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// external ["wp","blocks"]
const external_wp_blocks_namespaceObject = window["wp"]["blocks"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// external ["wp","blockEditor"]
const external_wp_blockEditor_namespaceObject = window["wp"]["blockEditor"];
;// external ["wp","components"]
const external_wp_components_namespaceObject = window["wp"]["components"];
;// external ["wp","element"]
const external_wp_element_namespaceObject = window["wp"]["element"];
;// external ["wp","data"]
const external_wp_data_namespaceObject = window["wp"]["data"];
;// external ["wp","coreData"]
const external_wp_coreData_namespaceObject = window["wp"]["coreData"];
;// external ["wp","primitives"]
const external_wp_primitives_namespaceObject = window["wp"]["primitives"];
;// external "ReactJSXRuntime"
const external_ReactJSXRuntime_namespaceObject = window["ReactJSXRuntime"];
;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/update.mjs
// packages/icons/src/library/update.tsx


var update_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "m11.3 17.2-5-5c-.1-.1-.1-.3 0-.4l2.3-2.3-1.1-1-2.3 2.3c-.7.7-.7 1.8 0 2.5l5 5H7.5v1.5h5.3v-5.2h-1.5v2.6zm7.5-6.4-5-5h2.7V4.2h-5.2v5.2h1.5V6.8l5 5c.1.1.1.3 0 .4l-2.3 2.3 1.1 1.1 2.3-2.3c.6-.7.6-1.9-.1-2.5z" }) });

//# sourceMappingURL=update.mjs.map

;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/rotate-left.mjs
// packages/icons/src/library/rotate-left.tsx


var rotate_left_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "M12 4V2.2L9 4.8l3 2.5V5.5c3.6 0 6.5 2.9 6.5 6.5 0 2.9-1.9 5.3-4.5 6.2v.2l-.1-.2c-.4.1-.7.2-1.1.2l.2 1.5c.3 0 .6-.1 1-.2 3.5-.9 6-4 6-7.7 0-4.4-3.6-8-8-8zm-7.9 7l1.5.2c.1-1.2.5-2.3 1.2-3.2l-1.1-.9C4.8 8.2 4.3 9.6 4.1 11zm1.5 1.8l-1.5.2c.1.7.3 1.4.5 2 .3.7.6 1.3 1 1.8l1.2-.8c-.3-.5-.6-1-.8-1.5s-.4-1.1-.4-1.7zm1.5 5.5c1.1.9 2.4 1.4 3.8 1.6l.2-1.5c-1.1-.1-2.2-.5-3.1-1.2l-.9 1.1z" }) });

//# sourceMappingURL=rotate-left.mjs.map

;// ./dev/javascript/_utils/tools.js
/* eslint-disable no-bitwise */
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
/* eslint-enable no-bitwise */

// ⚠️ String() first: a number or a boolean from a filtered payload threw here, and the
// carousel then silently did not open (re-audit, 2026-10-17).
const escAttr = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const splitValueAndUnit = value => {
  const match = value.match(/^([\d.]+)([a-z%]*)$/i);
  if (!match) {
    return [0, ''];
  }
  return [parseFloat(match[1]), match[2]];
};

/**
 * Fill a translated template's numbered placeholders (`%1$s`, `%2$s` …) in one pass.
 *
 * ⚠️ Not chained `String.replace` calls. A value went in as a replacement string, so `$&` or
 * `$$` in a caption was read as a pattern, and a value filled first was scanned again — a
 * caption containing `%1$s` had the position written into it (re-audit, 2026-10-17, A11).
 * One pass with a function replacer reads the template once and writes values as given.
 *
 * @param {string}             template A translated string.
 * @param {...(string|number)} values   The values, in placeholder order.
 * @return {string} The filled string.
 */
const fillPlaceholders = (template, ...values) => String(template).replace(/%(\d+)\$s/g, (placeholder, n) => values[n - 1] === undefined ? placeholder : String(values[n - 1]));
;// ./dev/javascript/_lib/constants.js
const GALLERY_ITEM_SELECTOR = '.ghostlabs-serendipity__gallery-item';
const GALLERY_ITEM_CLASS = 'ghostlabs-serendipity__gallery-item';
const GALLERY_LOADING_CLASS = 'ghostlabs-serendipity--gallery-loading';
const GALLERY_LOADED_CLASS = 'ghostlabs-serendipity--gallery-loaded';
;// ./dev/javascript/_lib/gutters.js
/**
 * The gutter is painted, never stored.
 *
 * A saved layout is a partition of the gallery: tiles edge to edge, in percentages. The
 * gap is applied when the tiles are placed, half off each side of every inner edge, so
 * it is the gallery's Gap Size at any width and moves when that setting does.
 *
 * ⚠️ Every layout saved before 2026-10-13 carries its gutters inside its percentages —
 * at whatever width it was saved, and the composer's own margins with them. `toCells()`
 * closes them on read, so those layouts need no migration. `Service\Gutters` is the PHP
 * half and the first frame; the two must agree to the pixel, or a gallery shifts once
 * the script runs. Change one, change both, and both tests share one table.
 */

/** How close two edges (in percent) must be to count as touching. */
const EPSILON = 0.01;
const overlaps = (fromA, toA, fromB, toB) => Math.min(toA, toB) - Math.max(fromA, fromB) > EPSILON;

/**
 * Close every gutter at its midpoint, and send an edge with nothing beyond it to the
 * border — in a partition, only the border has nothing beyond it.
 *
 * @param {Array<Object>} rects Rectangles with `xPercent` … `heightPercent`.
 * @return {Array<Object>} The same rectangles as cells, every other key kept. Anything
 *                         not in percentages (a legacy pixel layout) comes back as given.
 */
const toCells = rects => {
  if (!Array.isArray(rects) || rects[0]?.xPercent === undefined) {
    return rects;
  }
  const boxes = rects.map(rect => ({
    left: rect.xPercent,
    top: rect.yPercent,
    right: rect.xPercent + rect.widthPercent,
    bottom: rect.yPercent + rect.heightPercent
  }));
  return rects.map((rect, index) => {
    const box = boxes[index];
    const others = boxes.filter((_, other) => other !== index);
    const beside = others.filter(other => overlaps(box.top, box.bottom, other.top, other.bottom));
    const across = others.filter(other => overlaps(box.left, box.right, other.left, other.right));
    const before = (edges, at) => {
      const found = edges.filter(edge => edge <= at + EPSILON);
      return found.length ? (Math.max(...found) + at) / 2 : 0;
    };
    const after = (edges, at) => {
      const found = edges.filter(edge => edge >= at - EPSILON);
      return found.length ? (Math.min(...found) + at) / 2 : 100;
    };
    const left = before(beside.map(other => other.right), box.left);
    const right = after(beside.map(other => other.left), box.right);
    const top = before(across.map(other => other.bottom), box.top);
    const bottom = after(across.map(other => other.top), box.bottom);
    return {
      ...rect,
      xPercent: left,
      yPercent: top,
      widthPercent: right - left,
      heightPercent: bottom - top
    };
  });
};

/**
 * Place cells as tiles: half the gap off each inner edge, nothing off the border.
 *
 * @param {Array<Object>} cells  Pixel cells `{ x, y, width, height }` partitioning the box.
 * @param {number}        width  The box's width, in pixels.
 * @param {number}        height The box's height, in pixels.
 * @param {number}        gap    The gutter, in pixels.
 * @return {Array<Object>} The tiles, every other key kept.
 */
const insetTiles = (cells, width, height, gap) => {
  const half = Math.max(0, gap) / 2;
  const inner = (at, limit) => at > 0.5 && at < limit - 0.5;
  return cells.map(cell => {
    const left = inner(cell.x, width) ? half : 0;
    const top = inner(cell.y, height) ? half : 0;
    const right = inner(cell.x + cell.width, width) ? half : 0;
    const bottom = inner(cell.y + cell.height, height) ? half : 0;
    return {
      ...cell,
      x: cell.x + left,
      y: cell.y + top,
      width: Math.max(0, cell.width - left - right),
      height: Math.max(0, cell.height - top - bottom)
    };
  });
};
;// ./dev/javascript/_lib/serendipity.js
/* eslint-disable no-console */



const SerendipityPreloader = (galleryContainer, debug = false) => {
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
    if (!galleryContainer) {
      return;
    }
    galleryContainer.classList.add(GALLERY_LOADING_CLASS);
    galleryContainer.classList.remove(GALLERY_LOADED_CLASS);
    activePreloaders.add(galleryContainer);

    // Set minimum height based on container or default
    const computedHeight = galleryContainer.style.height || getComputedStyle(galleryContainer).height;
    if (!computedHeight || computedHeight === 'auto') {
      galleryContainer.style.minHeight = '400px';
      placeholder = true;
    }
    if (debug) {
      console.log('🔄 Preloader started for gallery');
    }
  };

  /**
   * End preloader for a gallery
   */
  const endPreloader = () => {
    if (!galleryContainer) {
      return;
    }
    galleryContainer.classList.remove(GALLERY_LOADING_CLASS);
    galleryContainer.classList.add(GALLERY_LOADED_CLASS);
    activePreloaders.delete(galleryContainer);

    // Remove the placeholder after loading, if it is still ours.
    setTimeout(() => {
      if (placeholder && galleryContainer.style.minHeight === '400px') {
        galleryContainer.style.minHeight = '';
      }
      placeholder = false;
    }, 300); // Match CSS transition duration

    if (debug) {
      console.log('✅ Preloader ended for gallery');
    }
  };

  /**
   * Wait for all images in gallery to load
   * @param {Element} container
   */
  const waitForImages = async container => {
    if (!container) {
      return Promise.resolve();
    }
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise(resolve => {
        if (img.complete && img.naturalHeight > 0) {
          // Image already loaded
          resolve();
        } else {
          // Wait for image to load
          const onLoad = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onLoad);
            resolve();
          };
          img.addEventListener('load', onLoad);
          img.addEventListener('error', onLoad);
        }
      });
    });
    return Promise.all(imagePromises);
  };

  /**
   * Wait for critical images (first few) to load for faster perceived loading
   * @param {Element} container
   * @param {number}  count
   */
  const waitForCriticalImages = async (container, count = 3) => {
    if (!container) {
      return Promise.resolve();
    }
    const images = container.querySelectorAll('img');
    const criticalImages = Array.from(images).slice(0, count);
    const imagePromises = criticalImages.map(img => {
      return new Promise(resolve => {
        if (img.complete && img.naturalHeight > 0) {
          resolve();
        } else {
          const onLoad = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onLoad);
            resolve();
          };
          img.addEventListener('load', onLoad);
          img.addEventListener('error', onLoad);

          // Timeout after 3 seconds to prevent hanging
          setTimeout(resolve, 3000);
        }
      });
    });
    return Promise.all(imagePromises);
  };

  /**
   * Get loading strategy based on gallery size
   * @param {Element} container
   */
  const getLoadingStrategy = container => {
    const imageCount = container.querySelectorAll('img').length;
    if (imageCount <= 6) {
      return 'wait-all'; // Wait for all images in small galleries
    } else if (imageCount <= 12) {
      return 'wait-critical'; // Wait for first few in medium galleries
    }
    return 'immediate'; // Show immediately for large galleries
  };

  /**
   * Handle loading based on strategy
   * @param {Element} container
   */
  const handleLoading = async container => {
    if (!container) {
      return;
    }
    const strategy = getLoadingStrategy(container);
    switch (strategy) {
      case 'wait-all':
        await waitForImages(container);
        break;
      case 'wait-critical':
        await waitForCriticalImages(container, 4);
        break;
      case 'immediate':
        // Add small delay to allow layout calculation
        await new Promise(resolve => setTimeout(resolve, 100));
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
    releasePlaceholder
  };
};

/**
 * Convert pixel-based rectangles to percentage-based rectangles
 * This makes layouts responsive and scalable
 * @param {Array}  rectangles
 * @param {number} containerWidth
 * @param {number} containerHeight
 */
const convertToPercentages = (rectangles, containerWidth, containerHeight) => {
  return rectangles.map(rect => ({
    // Store both pixel and percentage values
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    // Percentage values for responsive scaling
    xPercent: rect.x / containerWidth * 100,
    yPercent: rect.y / containerHeight * 100,
    widthPercent: rect.width / containerWidth * 100,
    heightPercent: rect.height / containerHeight * 100,
    // Preserve any additional properties
    ...(rect.objectPosition && {
      objectPosition: rect.objectPosition
    })
  }));
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
const convertToPixels = (rectangles, containerWidth, containerHeight, gap = 0) => {
  const cells = toCells(rectangles).map(rect => ({
    x: rect.xPercent / 100 * containerWidth,
    y: rect.yPercent / 100 * containerHeight,
    width: rect.widthPercent / 100 * containerWidth,
    height: rect.heightPercent / 100 * containerHeight,
    // Preserve additional properties
    ...(rect.objectPosition && {
      objectPosition: rect.objectPosition
    })
  }));
  return insetTiles(cells, containerWidth, containerHeight, gap);
};
const calculateContainerWidth = galleryContainer => {
  if (!galleryContainer) {
    return window.innerWidth;
  }
  const [parentInlinePaddingValue] = splitValueAndUnit(window.getComputedStyle(galleryContainer.parentNode).paddingInline);
  return galleryContainer.offsetWidth > window.innerWidth ? window.innerWidth - parentInlinePaddingValue * 2 : galleryContainer.offsetWidth;
};

/**
 * Enhanced Serendipity with responsive saved layouts
 * @param {Element} galleryContainer
 * @param {Object}  options
 */
const Serendipity = (galleryContainer, options = {
  gap: '2px',
  debug: false
}) => {
  if (!galleryContainer) {
    return;
  }
  const GAP = splitValueAndUnit(options.gap)[0] ?? 2;
  const MIN_HEIGHT = '720px';
  const DEBUG = options.debug;

  // Store the original container dimensions when layout was first calculated
  let originalDimensions = null;
  let savedPercentageLayout = null;
  const preloader = SerendipityPreloader(galleryContainer);
  preloader.startPreloader();
  if (!galleryContainer) {
    preloader.endPreloader();
    return;
  }
  const items = Array.from(galleryContainer.querySelectorAll(GALLERY_ITEM_SELECTOR));
  const totalItems = items.length;
  if (totalItems === 0) {
    preloader.endPreloader();
    return;
  }

  /**
   * Enhanced applyImprovedLayout with percentage conversion
   * @param {string}     minHeight
   * @param {Array|null} defaultRectangles
   * @param {string}     aspectRatio
   */
  const applyImprovedLayout = (minHeight, defaultRectangles = null, aspectRatio = 'auto') => {
    galleryContainer.style.display = 'block';
    galleryContainer.style.aspectRatio = aspectRatio;
    if (!galleryContainer.style.minHeight) {
      galleryContainer.style.minHeight = MIN_HEIGHT;
    }
    if (minHeight?.length > 0 && minHeight !== 'auto') {
      galleryContainer.style.minHeight = minHeight;
    }
    preloader.releasePlaceholder();

    // Reset all items for absolute positioning
    items.forEach(item => {
      item.style.gridColumn = '';
      item.style.gridRow = '';
      item.style.position = 'absolute';
      item.style.margin = '0';
      item.style.boxSizing = 'border-box';
      const link = item.querySelector('a');
      if (link) {
        link.style.display = 'block';
        link.style.width = '100%';
        link.style.height = '100%';
      }
      const img = item.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
      }
    });

    // const containerWidth = galleryContainer.offsetWidth > window.innerWidth ? (window.innerWidth - 120) : galleryContainer.offsetWidth;
    const containerWidth = calculateContainerWidth(galleryContainer);
    const containerHeight = galleryContainer.offsetHeight;
    let rectangles = [];
    if (defaultRectangles?.length > 0) {
      // 🎯 CHECK IF RECTANGLES ARE IN PERCENTAGE FORMAT
      const hasPercentages = defaultRectangles[0]?.xPercent !== undefined;
      if (hasPercentages) {
        // Convert percentage-based saved layout to current pixel dimensions
        rectangles = convertToPixels(defaultRectangles, containerWidth, containerHeight, GAP);
        if (DEBUG) {
          console.log('📐 Applied saved layout with responsive scaling');
        }
      } else {
        // Legacy pixel-based rectangles - use as-is (non-responsive)
        rectangles = defaultRectangles;
        if (DEBUG) {
          console.log('⚠️ Using pixel-based layout (non-responsive)');
        }
      }

      // Store the saved percentage layout for future resizes
      if (hasPercentages) {
        savedPercentageLayout = defaultRectangles;
        originalDimensions = {
          width: containerWidth,
          height: containerHeight
        };
      }
    } else {
      // Generate new layout
      const weights = generateRandomizedWeights(totalItems);

      // Composed edge to edge and saved that way; the gap is painted on top, the
      // same as for a saved layout, so what the author sees is what gets saved.
      savedPercentageLayout = convertToPercentages(balancedTreemap(weights, containerWidth, containerHeight, 0), containerWidth, containerHeight);
      rectangles = convertToPixels(savedPercentageLayout, containerWidth, containerHeight, GAP);
      originalDimensions = {
        width: containerWidth,
        height: containerHeight
      };
      if (DEBUG) {
        console.log('✨ Generated new responsive layout');
      }
    }

    // Apply calculated positions to items
    rectangles.forEach((rect, i) => {
      if (i < items.length) {
        const item = items[i];
        item.style.left = rect.x + 'px';
        item.style.top = rect.y + 'px';
        item.style.width = rect.width + 'px';
        item.style.height = rect.height + 'px';
        if (rect?.objectPosition) {
          const img = item.querySelector('img');
          if (img) {
            img.style.objectPosition = rect.objectPosition;
          }
        }
      }
    });
    return rectangles;
  };

  /**
   * Handle resize - reapply saved layout responsively
   */
  const handleResize = () => {
    if (!savedPercentageLayout) {
      return;
    }

    // const containerWidth = galleryContainer.offsetWidth;
    const containerWidth = calculateContainerWidth(galleryContainer);
    const containerHeight = galleryContainer.offsetHeight;

    // Convert saved percentages to new pixel values
    const scaledRectangles = convertToPixels(savedPercentageLayout, containerWidth, containerHeight, GAP);

    // Apply scaled positions
    scaledRectangles.forEach((rect, i) => {
      if (i < items.length) {
        const item = items[i];
        item.style.left = rect.x + 'px';
        item.style.top = rect.y + 'px';
        item.style.width = rect.width + 'px';
        item.style.height = rect.height + 'px';
      }
    });
    if (DEBUG) {
      console.log('🔄 Layout scaled to new dimensions:', {
        from: originalDimensions,
        to: {
          width: containerWidth,
          height: containerHeight
        }
      }, galleryContainer);
    }
  };

  /**
   * Get layout data for saving (in percentage format)
   */
  const getLayoutData = () => {
    if (!savedPercentageLayout) {
      if (DEBUG) {
        console.warn('No layout data available yet');
      }
      return null;
    }
    return {
      rectangles: savedPercentageLayout,
      originalDimensions,
      format: 'percentage',
      timestamp: new Date().toISOString(),
      totalItems
    };
  };

  /**
   * Load saved layout data
   * @param {Object} layoutData
   */
  const loadLayoutData = layoutData => {
    if (!layoutData || !layoutData.rectangles) {
      if (DEBUG) {
        console.error('Invalid layout data');
      }
      return false;
    }

    // Check format
    const hasPercentages = layoutData.rectangles[0]?.xPercent !== undefined;
    if (hasPercentages) {
      savedPercentageLayout = layoutData.rectangles;
      originalDimensions = layoutData.originalDimensions;
      if (DEBUG) {
        console.log('✅ Loaded percentage-based layout data');
      }
      return true;
    }
    // Convert old pixel-based data to percentages if original dimensions available
    if (layoutData.originalDimensions) {
      savedPercentageLayout = convertToPercentages(layoutData.rectangles, layoutData.originalDimensions.width, layoutData.originalDimensions.height);
      originalDimensions = layoutData.originalDimensions;
      if (DEBUG) {
        console.log('✅ Converted legacy pixel data to percentages');
      }
      return true;
    }
    if (DEBUG) {
      console.warn('⚠️ Cannot convert legacy data without original dimensions');
    }
    return false;
  };

  // Your existing helper functions (unchanged)
  const generateRandomizedWeights = count => {
    const weights = [];
    if (count <= 6) {
      for (let i = 0; i < count; i++) {
        weights.push(0.8 + Math.random() * 0.4);
      }
    } else {
      const featureCount = Math.min(Math.floor(count / 3), 3);
      for (let i = 0; i < count; i++) {
        if (i < featureCount) {
          weights.push(1.5 + Math.random() * 0.5);
        } else {
          weights.push(0.7 + Math.random() * 0.6);
        }
      }
    }
    return shuffleArray(weights);
  };
  const shuffleArray = array => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const balancedTreemap = (data, width, height, padding = 0) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const normalizedData = data.map(value => value / total);
    const totalArea = width * height;
    const areas = normalizedData.map(value => value * totalArea);
    return binaryPartition(areas, {
      x: 0,
      y: 0,
      width,
      height
    }, padding);
  };
  const binaryPartition = (areas, container, padding) => {
    if (areas.length === 0) {
      return [];
    }
    if (areas.length === 1) {
      return [{
        x: container.x + padding,
        y: container.y + padding,
        width: container.width - padding * 2,
        height: container.height - padding * 2
      }];
    }
    const sortedAreas = [...areas].sort((a, b) => b - a);
    const splitHorizontally = container.width > container.height;
    const totalArea = sortedAreas.reduce((sum, area) => sum + area, 0);
    let currentSum = 0;
    let splitIndex = 0;
    const targetRatio = 0.4 + Math.random() * 0.2;
    for (let i = 0; i < sortedAreas.length; i++) {
      currentSum += sortedAreas[i];
      const ratio = currentSum / totalArea;
      if (ratio >= targetRatio) {
        splitIndex = i + 1;
        break;
      }
    }
    splitIndex = Math.max(1, Math.min(splitIndex, areas.length - 1));
    const firstGroup = sortedAreas.slice(0, splitIndex);
    const secondGroup = sortedAreas.slice(splitIndex);
    const firstGroupArea = firstGroup.reduce((sum, area) => sum + area, 0);
    const secondGroupArea = secondGroup.reduce((sum, area) => sum + area, 0);
    const firstGroupRatio = firstGroupArea / (firstGroupArea + secondGroupArea);
    let firstContainer, secondContainer;
    if (splitHorizontally) {
      const splitWidth = container.width * firstGroupRatio;
      firstContainer = {
        x: container.x,
        y: container.y,
        width: splitWidth - padding / 2,
        height: container.height
      };
      secondContainer = {
        x: container.x + splitWidth + padding / 2,
        y: container.y,
        width: container.width - splitWidth - padding,
        height: container.height
      };
    } else {
      const splitHeight = container.height * firstGroupRatio;
      firstContainer = {
        x: container.x,
        y: container.y,
        width: container.width,
        height: splitHeight - padding / 2
      };
      secondContainer = {
        x: container.x,
        y: container.y + splitHeight + padding / 2,
        width: container.width,
        height: container.height - splitHeight - padding
      };
    }
    return [...binaryPartition(firstGroup, firstContainer, padding), ...binaryPartition(secondGroup, secondContainer, padding)];
  };
  const init = async (minHeight, defaultRectangles = null, aspectRatio = 'auto') => {
    await preloader.handleLoading();
    preloader.startPreloader();
    const rectangles = applyImprovedLayout(minHeight, defaultRectangles, aspectRatio);

    // 🎯 DISPATCH EVENT WITH PERCENTAGE-BASED DATA
    const layoutEvent = new CustomEvent('serendipityLayoutCalculated', {
      detail: {
        galleryId: galleryContainer.parentNode.dataset.galleryId,
        rectangles: savedPercentageLayout || rectangles,
        // Send percentage data
        pixelRectangles: rectangles,
        // Also include pixel data for reference
        originalDimensions,
        format: 'percentage',
        element: galleryContainer
      }
    });
    document.dispatchEvent(layoutEvent);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        preloader.endPreloader(galleryContainer);
      });
    });
  };

  /**
   * Remove all custom styling and attributes
   */
  const destroy = () => {
    // Remove container styles
    galleryContainer.style.removeProperty('display');
    galleryContainer.style.removeProperty('aspect-ratio');
    galleryContainer.style.removeProperty('min-height');

    // Remove preloader classes
    galleryContainer.classList.remove(GALLERY_LOADING_CLASS);
    galleryContainer.classList.remove(GALLERY_LOADED_CLASS);

    // Reset items
    items.forEach(item => {
      item.removeAttribute('style');
      const link = item.querySelector('a');
      if (link) {
        link.removeAttribute('style');
      }
      const img = item.querySelector('img');
      if (img) {
        img.removeAttribute('style');
      }
    });
    if (DEBUG) {
      console.log('🗑️ Serendipity instance destroyed');
    }
  };
  const isInitialized = () => {
    return galleryContainer.classList.contains(GALLERY_LOADED_CLASS);
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
    convertToPercentages: rects => convertToPercentages(rects, originalDimensions.width, originalDimensions.height),
    convertToPixels: rects => convertToPixels(rects, galleryContainer.offsetWidth, galleryContainer.offsetHeight, GAP)
  };
};
;// external ["wp","a11y"]
const external_wp_a11y_namespaceObject = window["wp"]["a11y"];
;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/close-small.mjs
// packages/icons/src/library/close-small.tsx


var close_small_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z" }) });

//# sourceMappingURL=close-small.mjs.map

;// external "React"
const external_React_namespaceObject = window["React"];
;// ./src/blocks/serendipity/_components/LinkIcon.jsx


const LinkIcon = () => {
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    stroke: "currentColor",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
    "data-icon": "SvgLink",
    "aria-hidden": "true",
    children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("path", {
      d: "M10.8 17.8l-1.512 1.513L8.6 20A3.2 3.2 0 014 20m0 0a3.2 3.2 0 010-4.6l2.45-2.45L8.9 10.5a3.284 3.284 0 012.112-.975 3.231 3.231 0 012.188.675m.2-4.2l1.413-1.412L15.4 4A3.253 3.253 0 1120 8.6l-2.45 2.45-2.45 2.45a3.143 3.143 0 01-2.012 1A3.2 3.2 0 0111 14"
    })
  });
};
/* harmony default export */ const _components_LinkIcon = (LinkIcon);
;// ./src/blocks/serendipity/_lib/capabilities.js
/**
 * What this build is entitled to, as published by BlockFactory.
 *
 * The editor gate. It disables controls the build cannot use and says why, rather than
 * offering one that silently fails on save — but it is only ever a courtesy. Anything
 * the editor lets through is checked again when the attributes are validated, and again
 * when the block renders, so a value that reaches the database another way still
 * degrades rather than unlocking.
 *
 * Absent means not entitled. A build that published nothing gets the free feature set,
 * which is the safe direction for a global that any script could have failed to print.
 */
const CAPABILITY = {
  BUILT_IN_LIGHTBOX: 'built-in-lightbox',
  HOVER_STYLES_EXTENDED: 'hover-styles-extended',
  PAN_TILT: 'pan-tilt',
  LAYOUT_STUDIO: 'layout-studio',
  PATTERN_LIBRARY: 'pattern-library'
};

/**
 * @param {string} capability One of CAPABILITY.
 * @return {boolean} Whether this build may use it.
 */
const hasCapability = capability => window.ghostlabsSerendipityCapabilities?.[capability] === true;
;// ./src/blocks/serendipity/_lib/upgradeUrl.js
/**
 * Where an upgrade link in the editor points — as PHP built it, or nowhere.
 *
 * 🔴 **No literal in JavaScript, and no fallback.** A hard-coded URL renders, resolves and
 * silently drops the attribution. The edition that sells something inlines a map of finished
 * URLs, one per surface, each carrying its own `from=` (`BlockFactory::publishCapabilities()`,
 * filled by the free edition's boot). This reads it. Where the map is absent — any edition with
 * nothing to sell — every surface gets `null`, and the caller renders no link.
 *
 * The block is built once and ships to both editions, which is why the URLs cannot live here.
 */
const UPSELL = {
  HOVER_STYLE: 'editor-hover-style',
  LIGHTBOX: 'editor-lightbox',
  LAYOUT_STUDIO: 'editor-layout-studio'
};

/**
 * @param {string} surface One of UPSELL.
 * @return {string|null} The finished URL, or null where PHP supplied none.
 */
const upgradeUrl = surface => {
  const url = window.ghostlabsSerendipityUpgrade?.urls?.[surface];
  return typeof url === 'string' && url !== '' ? url : null;
};

/**
 * Whether this edition sells anything at all. A refusal without a map is a licensed edition
 * whose license is not active, and it says so rather than pitching the free edition's upgrade.
 *
 * @return {boolean} True where PHP inlined an upgrade map.
 */
const sellsUpgrade = () => typeof window.ghostlabsSerendipityUpgrade?.urls === 'object' && window.ghostlabsSerendipityUpgrade.urls !== null;
;// ./src/blocks/serendipity/_lib/stylesModel.js





/**
 * What a locked style renders as: `Capabilities::FREE_HOVER_STYLE`, applied by
 * `AttributeGate`. The stored value is kept.
 */

const FREE_STYLE = 'style-1';

/**
 * The hover styles, and which of them a license buys.
 *
 * Two are free — none, and Fade-Up — and three are not. Since 2026-10-03 the locked three are
 * offered like any other and **answer the click** (the convention's Upsell select, register
 * § Upgrade prompts in the free build): the value never reaches the block, and a notice names
 * the choice and the style still in effect. They used to be disabled with the paid tier's name appended,
 * which refused the click and explained nothing.
 *
 * ⚠️ **The labels resolve when asked, never at import.** This module is imported once, early;
 * a list built at module scope bakes in whichever locale loaded first, and the refusal notice
 * reads these names.
 *
 * @return {Array<{label: string, value: string, licensed?: boolean}>} The styles, in order.
 */
const styles = () => [{
  label: (0,external_wp_i18n_namespaceObject.__)('None', 'ghostlabs-serendipity'),
  value: ''
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Fade-Up', 'ghostlabs-serendipity'),
  value: FREE_STYLE
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Split Reveal', 'ghostlabs-serendipity'),
  value: 'style-2',
  licensed: true
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Zoom and Blur Focus', 'ghostlabs-serendipity'),
  value: 'style-3',
  licensed: true
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Card Flip', 'ghostlabs-serendipity'),
  value: 'style-5',
  licensed: true
}];

/**
 * @param {string} value A hover style value.
 * @return {boolean} Whether this build may not use it.
 */
const isLockedHoverStyle = value => !hasCapability(CAPABILITY.HOVER_STYLES_EXTENDED) && styles().some(style => style.licensed && style.value === value);

/**
 * @param {string} value A hover style value.
 * @return {string} Its name, in the current locale.
 */
const hoverStyleName = value => styles().find(style => style.value === value)?.label ?? value;

/**
 * What the site actually shows for a stored style.
 *
 * @param {string} stored The block's hover style.
 * @return {string} The stored style, or Fade-Up where it is locked.
 */
const hoverRunning = stored => isLockedHoverStyle(stored) ? FREE_STYLE : stored;

/**
 * Options for the SelectControl. Every style is offered; only the one just refused is
 * disabled, a beat after it was chosen (`useRefusal`).
 *
 * @param {string|null} refused The style currently refused, or null.
 * @return {Array<{label: string, value: string, disabled?: boolean}>} Select options.
 */
const hoverStyleOptions = (refused = null) => styles().map(({
  label,
  value
}) => value === refused && isLockedHoverStyle(value) ? {
  label,
  value,
  disabled: true
} : {
  label,
  value
});

/**
 * The refusal, as words. Claims-checked 2026-10-03; the lapsed-license wording is new with
 * this build.
 *
 * ⚠️ **Naming what is still in effect is what keeps the control honest.** The field goes on
 * showing the author's pick, which the block does not have; nothing else on screen says so.
 *
 * @param {Object}  notice
 * @param {string}  notice.picked   The style chosen, or the locked one the block holds.
 * @param {string}  notice.running  What the site shows.
 * @param {boolean} notice.isStored True when the block itself holds a locked style — a
 *                                  downgraded block, or one locked style swapped for another.
 * @return {{title: string, lines: string[], url: string|null}} The notice's copy.
 */
const hoverRefusalCopy = ({
  picked,
  running,
  isStored
}) => {
  const sells = sellsUpgrade();
  const title = sells ? (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of a hover style, e.g. "Card Flip". */
  (0,external_wp_i18n_namespaceObject.__)('%s is a Serendipity Deluxe hover style.', 'ghostlabs-serendipity'), hoverStyleName(picked)) : (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of a hover style, e.g. "Card Flip". */
  (0,external_wp_i18n_namespaceObject.__)('%s needs an active Serendipity Deluxe license.', 'ghostlabs-serendipity'), hoverStyleName(picked));
  let outcome;
  if (isStored) {
    outcome = (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of the free hover style, "Fade-Up". */
    (0,external_wp_i18n_namespaceObject.__)('This gallery keeps that setting; your site shows %s in its place.', 'ghostlabs-serendipity'), hoverStyleName(FREE_STYLE));
  } else if (running === '') {
    outcome = (0,external_wp_i18n_namespaceObject.__)('Your gallery still has no hover style — nothing changed.', 'ghostlabs-serendipity');
  } else {
    outcome = (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of a hover style, e.g. "Fade-Up". */
    (0,external_wp_i18n_namespaceObject.__)('Your gallery still uses %s — nothing changed.', 'ghostlabs-serendipity'), hoverStyleName(running));
  }
  const lines = sells ? [(0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of the free hover style, "Fade-Up". */
  (0,external_wp_i18n_namespaceObject.__)('Free includes %s.', 'ghostlabs-serendipity'), hoverStyleName(FREE_STYLE)), outcome] : [outcome];
  return {
    title,
    lines,
    url: upgradeUrl(UPSELL.HOVER_STYLE)
  };
};
const StylesElements = ({
  style,
  caption
}) => {
  if (style === 'style-2') {
    if (!caption?.length) {
      return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "caption",
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_LinkIcon, {})
      });
    }
    return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
      className: "caption",
      children: caption
    });
  }
  if (style === 'style-3') {
    if (!caption?.length) {
      return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "caption-container",
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
          className: "caption",
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_LinkIcon, {})
        })
      });
    }
    return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
      className: "caption-container",
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "caption",
        children: caption
      })
    });
  }
  if (style === 'style-5') {
    if (!caption?.length) {
      return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "back",
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
          className: "caption",
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_LinkIcon, {})
        })
      });
    }
    return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
      className: "back",
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "caption",
        children: caption
      })
    });
  }
  return '';
};
;// ./src/blocks/serendipity/_lib/tileNames.js
/**
 * The text of an HTML fragment. Parsed, never inserted: `DOMParser` runs no script.
 *
 * @param {string} [html] The fragment.
 * @return {string} Its text.
 */
const textOf = (html = '') => /[<&]/.test(html) ? new window.DOMParser().parseFromString(html, 'text/html').body.textContent ?? '' : html;

/**
 * What a tile's photograph is called, for any control that names a tile, such as the editor
 * tile's Remove image button.
 *
 * ⚠️ Nothing on the canvas shows a tile's number, so a control named "Tile 4", or one named
 * the same on every tile, cannot tell a screen-reader author which photograph it means. The
 * photograph's alt text says what it shows; failing that its caption, and failing that its
 * file's name, without the size WordPress appends or the extension.
 *
 * A caption is HTML (the media merge copies `caption.raw`), so only its text is used: markup in
 * an accessible name is read out as markup.
 *
 * @param {Object} photograph
 * @param {string} [photograph.alt]     Its alt text.
 * @param {string} [photograph.caption] Its caption.
 * @param {string} [photograph.src]     Its URL.
 * @return {string} A name, or '' when nothing names it.
 */
const tilePhotographName = ({
  alt,
  caption,
  src
} = {}) => {
  const named = [alt, textOf(caption)].map(text => (text ?? '').trim()).find(Boolean);
  if (named) {
    return named;
  }
  const file = (src ?? '').split(/[?#]/)[0].split('/').pop() ?? '';
  return file.replace(/\.[a-z0-9]+$/i, '').replace(/-\d+x\d+$/, '');
};
;// ./src/blocks/serendipity/_components/GalleryItem.jsx
/**
 * WordPress dependencies
 */







/**
 * Gallery item component that displays an image with hover effects and remove functionality.
 *
 * @param {Object}   props            - Component properties.
 * @param {Object}   props.image      - Image object containing url, alt, caption, and id.
 * @param {number}   props.index      - Index of the image in the gallery.
 * @param {Function} props.onRemove   - Called with the image, its index, and whether the button
 *                                      had focus (a keyboard press) when it was pressed.
 * @param {string}   props.hoverStyle - Style class for hover effect.
 * @return {JSX.Element} Gallery item component.
 */

const GalleryItem = ({
  image,
  index,
  onRemove,
  hoverStyle
}) => {
  const name = tilePhotographName({
    alt: image.alt,
    caption: image.caption,
    src: image.url
  });

  // Every tile's button said "Remove image", so a list of buttons was five of the same.
  const removeLabel = name ? (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the photograph's alt text, caption or file name. */
  (0,external_wp_i18n_namespaceObject.__)('Remove image: %s', 'ghostlabs-serendipity'), name) : (0,external_wp_i18n_namespaceObject.__)('Remove image', 'ghostlabs-serendipity');
  const classes = [GALLERY_ITEM_SELECTOR.replace(/^\.+/, ''), `${GALLERY_ITEM_CLASS}--${hoverStyle}`].filter(Boolean).join(' ');
  return (
    /*#__PURE__*/
    // A list item, focusable so the keyboard can reveal Remove and so Layout Studio's Pan &
    // tilt can follow the tile in focus. ⚠️ Not role="button": it activates nothing, and the
    // role took its list-item semantics away and nested the Remove button inside a button
    // (accessibility audit, 2026-10-16 — the front end lost the same role on 2026-09-26).
    (0,external_ReactJSXRuntime_namespaceObject.jsxs)("li", {
      className: classes,
      "data-caption": image.caption || '',
      tabIndex: 0,
      children: [hoverStyle === 'style-5' ? /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: 'front',
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("img", {
          src: image.url,
          alt: image.alt || '',
          "data-id": image.id,
          "data-index": index
        })
      }) : /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("img", {
        src: image.url,
        alt: image.alt || '',
        "data-id": image.id,
        "data-index": index
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(StylesElements, {
        caption: image.caption || '',
        image: image,
        style: hoverStyle
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "gallery-item-actions",
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.Button, {
          className: "remove-button"
          // ⚠️ An SVG, not a Dashicon name: the canvas is an iframe that loads no
          // dashicons font, and "no-alt" rendered as an empty square (2026-10-18).
          ,
          icon: close_small_default,
          label: removeLabel
          // ⚠️ A mouse press must not move focus here. Firefox and Safari scroll a newly
          // focused element into view, and this button sits at the tile's bottom edge: when
          // that edge was at the bottom of the canvas, the press scrolled the page, the
          // release landed on the canvas, and no click ever reached the button (2026-10-18).
          // Keyboard focus and Enter/Space are untouched.
          ,
          onMouseDown: event => event.preventDefault(),
          onClick: event => onRemove(image, index, event.currentTarget.ownerDocument.activeElement === event.currentTarget)
        })
      })]
    })
  );
};
/* harmony default export */ const _components_GalleryItem = (GalleryItem);
;// ./src/blocks/serendipity/_lib/_utils.js
const getAlignmentClass = alignment => {
  return alignment ? ` align${alignment}` : '';
};
;// ./dev/javascript/_lib/layoutResolution.js
/**
 * Which saved layout, if any, a gallery should render with.
 *
 * Layouts are saved per breakpoint, and until now the lookup was a single
 * `find( item => item.deviceType === deviceType )`. Both of its failure modes were
 * silent and both produced a *different gallery on every page load*:
 *
 * 1. **No entry for this breakpoint.** An author who composed at Desktop and never
 *    opened the Tablet tab got `null`, and the layout engine composed a fresh random
 *    mosaic — which is not the composition they approved, and not the same one twice.
 * 2. **An entry whose rectangle count no longer matches the images.** Rectangles map to
 *    images positionally, so adding an image left the last tile with no geometry (a
 *    zero-sized box at the origin) and removing one left a hole in the mosaic.
 *
 * Percentage rectangles already scale to any container (`convertToPixels`), so a layout
 * authored at one breakpoint is a far better answer at another than a random one. That
 * is what this resolves.
 */

/**
 * Narrow to wide. The order is the distance metric — Tablet is one step from either
 * neighbor, Mobile is two from Desktop.
 */
const DEVICE_ORDER = ['Mobile', 'Tablet', 'Desktop'];

/**
 * Rectangles saved as percentages of the container, rather than the legacy pixel form.
 * Only these can be borrowed across breakpoints: pixel geometry authored at 1440px
 * means nothing at 390px.
 *
 * @param {Object} entry A saved layout entry.
 * @return {boolean} Whether its rectangles scale.
 */
const isScalable = entry => entry?.rectangles?.[0]?.xPercent !== undefined;

/**
 * @param {Object} entry     A saved layout entry.
 * @param {number} itemCount How many images the block currently has.
 * @return {boolean} Whether the entry still describes this gallery.
 */
const describesGallery = (entry, itemCount) => Array.isArray(entry?.rectangles) && entry.rectangles.length === itemCount && DEVICE_ORDER.includes(entry?.deviceType);

/**
 * The saved layout to use for this breakpoint.
 *
 * An exact match wins in whatever format it was saved in. Failing that, the nearest
 * breakpoint whose rectangles scale — and on a tie (Tablet, with Mobile and Desktop both
 * saved) the wider one, because a composition authored at Desktop is the one the author
 * most likely thought of as the gallery.
 *
 * @param {Array}  layoutData Saved layouts, one per breakpoint.
 * @param {string} deviceType The breakpoint being rendered.
 * @param {number} itemCount  How many images the block currently has.
 * @return {{layout: Object|null, borrowed: boolean}} The entry, and whether it came from
 * another breakpoint.
 */
const resolveLayout = (layoutData, deviceType, itemCount) => {
  const usable = (Array.isArray(layoutData) ? layoutData : []).filter(entry => describesGallery(entry, itemCount));
  const exact = usable.find(entry => entry.deviceType === deviceType);
  if (exact) {
    return {
      layout: exact,
      borrowed: false
    };
  }
  const here = DEVICE_ORDER.indexOf(deviceType);
  if (here === -1) {
    return {
      layout: null,
      borrowed: false
    };
  }
  const nearest = usable.filter(isScalable).sort((a, b) => {
    const distance = Math.abs(DEVICE_ORDER.indexOf(a.deviceType) - here) - Math.abs(DEVICE_ORDER.indexOf(b.deviceType) - here);
    return distance || DEVICE_ORDER.indexOf(b.deviceType) - DEVICE_ORDER.indexOf(a.deviceType);
  })[0];
  return nearest ? {
    layout: nearest,
    borrowed: true
  } : {
    layout: null,
    borrowed: false
  };
};
;// ./src/blocks/serendipity/_lib/composition.js


/**
 * Why the canvas is being recomposed: what the author asked for at the current
 * breakpoint, or an attribute that changed without it.
 *
 * ⚠️ An author's request is carried out by composing the canvas **first** and changing
 * the attribute **after**, against the gallery that was actually composed. The three
 * controls once did it the other way round: they changed `layoutData` and trusted the
 * canvas to follow. It never did — `GalleryGrid` does not recompose on `layoutData` — so
 * the inspector's "Refresh Layout" cleared the attribute and left the old composition on
 * screen for "Save" to write straight back, and the toolbar's "Refresh Layout & Save"
 * saved the composition it had just replaced, from a stale closure, on a timer. Undo and
 * redo are the other direction — the attribute moves first — and `FOLLOW` is how the
 * canvas catches up.
 */
const COMPOSE = {
  /** A new composition, left unsaved for the author to keep or refresh again. */
  REFRESH: 'refresh',
  /** A new composition, saved as soon as it is on the canvas. */
  REFRESH_AND_SAVE: 'refresh-and-save',
  /** The breakpoint unsaved: whatever the front end would show in its place. */
  RESET: 'reset',
  /** The attribute changed underneath the canvas (undo, redo): compose it as a reload would. */
  FOLLOW: 'follow'
};
const NOTHING_SAVED = {
  layout: null,
  borrowed: false
};

/**
 * Which saved layout, if any, the canvas should be composed from.
 *
 * With no request, or to follow the attribute, this is exactly the front end's
 * resolution. A refresh ignores every saved entry — the nearest breakpoint's composition
 * is not a new one, and borrowing it is how the toolbar's refresh once "refreshed" Desktop
 * into a copy of Tablet. A reset
 * resolves as though this breakpoint had never been saved, which is what the front end
 * will do once the entry is gone.
 *
 * @param {Array<Object>} layoutData The saved layouts, every breakpoint.
 * @param {string}        deviceType The breakpoint being composed.
 * @param {number}        imageCount How many images the gallery has.
 * @param {string|null}   request    One of COMPOSE, or null.
 * @return {{layout: Object|null, borrowed: boolean}} As `resolveLayout()`.
 */
const resolveComposition = (layoutData, deviceType, imageCount, request = null) => {
  if (request === COMPOSE.REFRESH || request === COMPOSE.REFRESH_AND_SAVE) {
    return NOTHING_SAVED;
  }
  const source = request === COMPOSE.RESET ? layoutData.filter(datum => datum.deviceType !== deviceType) : layoutData;
  return resolveLayout(source, deviceType, imageCount);
};

/**
 * `layoutData` with one breakpoint's composition saved into it.
 *
 * Every other breakpoint is kept, and nothing is written into the array or the entries it
 * was given — both belong to the block editor.
 *
 * @param {Array<Object>} layoutData The saved layouts, every breakpoint.
 * @param {string}        deviceType The breakpoint being saved.
 * @param {Object}        layout     What the composer produced for it.
 * @return {Array<Object>} The layouts to save.
 */
const withLayout = (layoutData, deviceType, layout) => layoutData.some(datum => datum.deviceType === deviceType) ? layoutData.map(datum => datum.deviceType === deviceType ? {
  ...datum,
  ...layout
} : datum) : [...layoutData, layout];
;// ./src/blocks/serendipity/_components/GalleryGrid.jsx

/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */





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

const GalleryGrid = ({
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
  onComposed
}) => {
  const galleryRef = (0,external_wp_element_namespaceObject.useRef)(null);

  // Which request has been carried out. A request is honored once, by the first
  // composition that completes after it — not by every later one a gap or height change
  // sets off, or a gallery refreshed an hour ago would refresh again on every nudge.
  const handled = (0,external_wp_element_namespaceObject.useRef)(recompose.count);

  // The composition lands on a timer, and whatever it reports back has to reach the
  // render that is current *then*, not the one that started it: the save reads
  // `layoutData`, and saving from a stale copy would undo anything changed meanwhile.
  const onComposedRef = (0,external_wp_element_namespaceObject.useRef)(onComposed);
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    onComposedRef.current = onComposed;
  });

  // Which photographs the tiles show, in order, the way a tile is keyed. ⚠️ The canvas once
  // composed only on the dependencies below and never on the photographs: a removed one left
  // a hole, and undoing the removal mounted a tile with no position, which filled the gallery
  // over the rest (owner, 2026-10-20). Not `images` itself: the library's details merged into
  // an entry replace the array, and recomposing on that would flash the gallery for nothing.
  const photographs = (images || []).map(image => image.id || image.url).join('\n');
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    if (!galleryRef.current) {
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
    const request = pending && recompose.deviceType === deviceType ? recompose.mode : null;
    const initializeGallery = async () => {
      // The same resolution the front end uses, for the same reason: a gallery
      // with no composition saved at this breakpoint should borrow the nearest
      // one rather than compose a new one at random. It matters most in the
      // inserter, where a pattern would otherwise preview as a different
      // gallery every time it was opened. Only an author's refresh or reset
      // resolves differently — see `resolveComposition()`.
      const {
        layout,
        borrowed
      } = resolveComposition(layoutData, deviceType, images.length, request);

      // Re-read the ref rather than trusting the one this effect closed over: the
      // timer has already waited, and the node may have gone in the meantime.
      const gallery = galleryRef.current ? Serendipity(galleryRef.current, {
        gap
      }) : null;

      // `Serendipity()` answers undefined for a container with no items in it —
      // an unmounted preview, or a gallery whose images have not been rendered
      // yet. That is a reason to stop, not a reason to throw.
      if (!gallery) {
        return null;
      }
      await gallery.init(!borrowed && layout?.minHeight ? layout.minHeight : minHeight, layout?.rectangles || null);
      return gallery;
    };
    let resizing = null;
    const timer = setTimeout(() => {
      initializeGallery().then(gallery => {
        if (canceled || !gallery) {
          return null;
        }
        setGallery(gallery);

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
        resizing = new view.ResizeObserver(() => {
          if (container.clientWidth === width) {
            return;
          }
          width = container.clientWidth;
          view.cancelAnimationFrame(frame);
          frame = view.requestAnimationFrame(() => gallery.handleResize());
        });
        resizing.observe(container);
        const dimensions = gallery.galleryContainer.getBoundingClientRect();
        const aspectRatio = `${dimensions.width} / ${dimensions.height}`;
        setAspectRatio(aspectRatio);
        if (pending) {
          handled.current = recompose.count;
        }

        // The instance that was just composed, not the `gallery` state: that
        // is set above but not yet rendered, and saving from the previous
        // instance is exactly how the old composition got written back.
        if (request) {
          onComposedRef.current({
            gallery,
            aspectRatio,
            mode: request
          });
        }
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
    }, 420);
    return () => {
      canceled = true;
      clearTimeout(timer);
      resizing?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recompose.count, photographs, deviceType, align, gap, minHeight, parentBlockClientId, parentBlockAttributes?.align]);

  // Where focus goes once a tile removed by keyboard has left the canvas.
  const focusAfterRemoval = (0,external_wp_element_namespaceObject.useRef)(null);

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
  const removeImage = (image, index, hadFocus) => {
    const name = tilePhotographName({
      alt: image.alt,
      caption: image.caption,
      src: image.url
    });
    (0,external_wp_a11y_namespaceObject.speak)(name ? (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the photograph's alt text, caption or file name. */
    (0,external_wp_i18n_namespaceObject.__)('Removed %s.', 'ghostlabs-serendipity'), name) : (0,external_wp_i18n_namespaceObject.__)('Image removed.', 'ghostlabs-serendipity'));
    if (!hadFocus) {
      onRemoveImage(image);
      return;
    }
    if (images.length === 1) {
      // No tile is left to take focus, and this component is about to render nothing.
      const block = galleryRef.current?.closest('[data-block]');
      onRemoveImage(image);
      block?.focus();
      return;
    }
    focusAfterRemoval.current = index;
    onRemoveImage(image);
  };
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    const index = focusAfterRemoval.current;
    if (index === null) {
      return;
    }
    focusAfterRemoval.current = null;

    // By position, after the render: tiles are keyed by attachment id, else by index, so
    // the node that held the next photograph before the render may not hold it after.
    const tiles = galleryRef.current?.querySelectorAll(':scope > li') ?? [];
    tiles[Math.min(index, tiles.length - 1)]?.focus();
  }, [images]);
  if (!images || images.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("ul", {
    className: `ghostlabs-serendipity${getAlignmentClass(align)}`,
    ref: galleryRef,
    children: images.map((image, index) => /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_GalleryItem, {
      index: index,
      image: image,
      hoverStyle: hoverStyle,
      onRemove: removeImage
    }, `gallery-item-${image.id || index}`))
  });
};
/* harmony default export */ const _components_GalleryGrid = (GalleryGrid);
;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/gallery.mjs
// packages/icons/src/library/gallery.tsx


var gallery_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M16.375 4.5H4.625a.125.125 0 0 0-.125.125v8.254l2.859-1.54a.75.75 0 0 1 .68-.016l2.384 1.142 2.89-2.074a.75.75 0 0 1 .874 0l2.313 1.66V4.625a.125.125 0 0 0-.125-.125Zm.125 9.398-2.75-1.975-2.813 2.02a.75.75 0 0 1-.76.067l-2.444-1.17L4.5 14.583v1.792c0 .069.056.125.125.125h11.75a.125.125 0 0 0 .125-.125v-2.477ZM4.625 3C3.728 3 3 3.728 3 4.625v11.75C3 17.273 3.728 18 4.625 18h11.75c.898 0 1.625-.727 1.625-1.625V4.625C18 3.728 17.273 3 16.375 3H4.625ZM20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z" }) });

//# sourceMappingURL=gallery.mjs.map

;// ./src/blocks/serendipity/_components/MediaUploadControl.jsx
/**
 * WordPress dependencies
 */



// Aliased: `gallery` is also the name of MediaUpload's boolean prop below.


/**
 * Media Upload Control Component
 *
 * @param {Object}   props                - Component properties
 * @param {Array}    props.images         - Current selected images
 * @param {Function} props.onUpdateImages - Function to update images
 * @param {boolean}  props.toolbar
 */

const MediaUploadControl = ({
  images = [],
  onUpdateImages,
  toolbar = false
}) => {
  const hasImages = images && images.length > 0;
  const onSelectImages = newImages => {
    // Map the image data to the format we need
    const mappedImages = newImages.map(image => {
      return {
        id: image.id,
        url: image.url,
        alt: image.alt,
        caption: image.caption?.raw || image.caption || ''
      };
    });
    onUpdateImages(mappedImages);
  };
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_blockEditor_namespaceObject.MediaUploadCheck, {
    children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_blockEditor_namespaceObject.MediaUpload, {
      onSelect: onSelectImages,
      allowedTypes: ['image'],
      multiple: true,
      gallery: true,
      value: images.map(img => img.id),
      render: ({
        open
      }) => toolbar ? /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ToolbarButton, {
        icon: gallery_default,
        label: hasImages ? (0,external_wp_i18n_namespaceObject.__)('Edit Gallery', 'ghostlabs-serendipity') : (0,external_wp_i18n_namespaceObject.__)('Add Images', 'ghostlabs-serendipity'),
        onClick: open
      }) : /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
        className: "media-upload-control",
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.Button, {
          onClick: open,
          variant: "primary",
          className: "editor-media-placeholder__button",
          icon: gallery_default,
          children: hasImages ? (0,external_wp_i18n_namespaceObject.__)('Edit Gallery', 'ghostlabs-serendipity') : (0,external_wp_i18n_namespaceObject.__)('Add Images', 'ghostlabs-serendipity')
        })
      })
    })
  });
};
/* harmony default export */ const _components_MediaUploadControl = (MediaUploadControl);
;// ./src/blocks/serendipity/_lib/lightboxModel.js




/**
 * The Lightbox select's options. Mirrors the PHP enum of the same name.
 *
 * Four of these emit a plain anchor and let whatever lightbox the site already runs pick
 * the gallery up; the fifth opens the bundled carousel and is the only one that costs a
 * license.
 */
const LIGHTBOX = {
  OWN: 'own',
  FILE: 'file',
  ATTACHMENT: 'attachment',
  NONE: 'none',
  BUILT_IN: 'builtin'
};
const LIGHTBOX_DEFAULT = LIGHTBOX.OWN;

/**
 * The modes, in the select's order, with names resolved when asked.
 *
 * @return {Array<{label: string, value: string}>} The modes.
 */
const modes = () => [{
  label: (0,external_wp_i18n_namespaceObject.__)('Your lightbox plugin (default)', 'ghostlabs-serendipity'),
  value: LIGHTBOX.OWN
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Link to image file', 'ghostlabs-serendipity'),
  value: LIGHTBOX.FILE
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Link to attachment page', 'ghostlabs-serendipity'),
  value: LIGHTBOX.ATTACHMENT
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('No link', 'ghostlabs-serendipity'),
  value: LIGHTBOX.NONE
}, {
  label: (0,external_wp_i18n_namespaceObject.__)('Built-in carousel', 'ghostlabs-serendipity'),
  value: LIGHTBOX.BUILT_IN
}];

/**
 * @param {string} value A lightbox mode.
 * @return {boolean} Whether this build may not use it — only ever the carousel.
 */
const isLockedLightbox = value => value === LIGHTBOX.BUILT_IN && !hasCapability(CAPABILITY.BUILT_IN_LIGHTBOX);

/**
 * What the site actually uses for a stored mode: a locked carousel renders as
 * `Lightbox::DEFAULT`, applied by `AttributeGate`. The stored value is kept.
 *
 * @param {string} stored The block's lightbox mode.
 * @return {string} The mode in effect.
 */
const lightboxRunning = stored => isLockedLightbox(stored) ? LIGHTBOX_DEFAULT : stored;

/**
 * @param {string} value A lightbox mode.
 * @return {string} Its name, as the select shows it.
 */
const lightboxName = value => modes().find(mode => mode.value === value)?.label ?? value;

/**
 * Options for the SelectControl. Since 2026-10-03 the carousel is offered like any other mode
 * and **answers the click** (the convention's Upsell select): only once refused, a beat after
 * it was chosen, is it disabled. It stays the last option so the list does not reorder between
 * builds.
 *
 * @param {string|null} refused The mode currently refused, or null.
 * @return {Array<{label: string, value: string, disabled?: boolean}>} Select options.
 */
const lightboxOptions = (refused = null) => modes().map(({
  label,
  value
}) => value === refused && isLockedLightbox(value) ? {
  label,
  value,
  disabled: true
} : {
  label,
  value
});

/**
 * The refusal, as words. Claims-checked 2026-10-03; the lapsed-license wording is new with
 * this build.
 *
 * ⚠️ The "your lightbox plugin" line names `Lightbox::DEFAULT`, which is what `AttributeGate`
 * renders a locked carousel as. Change the default and this sentence changes with it.
 *
 * @param {Object}  notice
 * @param {string}  notice.running  The mode in effect.
 * @param {boolean} notice.isStored True when the block itself holds the carousel.
 * @return {{title: string, lines: string[], url: string|null}} The notice's copy.
 */
const lightboxRefusalCopy = ({
  running,
  isStored
}) => {
  const sells = sellsUpgrade();
  const outcome = isStored ? (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of a lightbox mode, e.g. "Your lightbox plugin". */
  (0,external_wp_i18n_namespaceObject.__)('This gallery keeps that setting; your site uses “%s” in its place.', 'ghostlabs-serendipity'), (0,external_wp_i18n_namespaceObject.__)('Your lightbox plugin', 'ghostlabs-serendipity')) : (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: the name of a lightbox mode, e.g. "Link to image file". */
  (0,external_wp_i18n_namespaceObject.__)('The Lightbox setting is still “%s” — nothing changed.', 'ghostlabs-serendipity'), lightboxName(running));
  return sells ? {
    title: (0,external_wp_i18n_namespaceObject.__)('The built-in carousel is in Serendipity Deluxe.', 'ghostlabs-serendipity'),
    lines: [(0,external_wp_i18n_namespaceObject.__)('It opens each photograph in a carousel with captions and autoplay, and needs no lightbox plugin.', 'ghostlabs-serendipity'), outcome],
    url: upgradeUrl(UPSELL.LIGHTBOX)
  } : {
    title: (0,external_wp_i18n_namespaceObject.__)('The built-in carousel needs an active Serendipity Deluxe license.', 'ghostlabs-serendipity'),
    lines: [outcome],
    url: null
  };
};

/**
 * The help text under the select, which is where the mode earns its keep.
 *
 * @param {string} value The selected lightbox mode.
 * @return {string} Help text.
 */
const lightboxHelp = value => {
  switch (value) {
    case LIGHTBOX.BUILT_IN:
      return (0,external_wp_i18n_namespaceObject.__)('Opens the bundled carousel. Loads its own script and styles on pages that use it.', 'ghostlabs-serendipity');
    case LIGHTBOX.ATTACHMENT:
      return (0,external_wp_i18n_namespaceObject.__)('Each image links to its attachment page.', 'ghostlabs-serendipity');
    case LIGHTBOX.NONE:
      return (0,external_wp_i18n_namespaceObject.__)('Images are not linked. Nothing happens on click.', 'ghostlabs-serendipity');
    case LIGHTBOX.FILE:
      return (0,external_wp_i18n_namespaceObject.__)('Each image links to the full-size file, ungrouped — for lightboxes that do their own grouping.', 'ghostlabs-serendipity');
    default:
      return (0,external_wp_i18n_namespaceObject.__)('Links each image to the full-size file and groups the gallery, so a lightbox plugin you already run can pick it up.', 'ghostlabs-serendipity');
  }
};
;// ./src/blocks/serendipity/_lib/useRefusal.js


/**
 * How long a locked option stays offered after it has been chosen.
 *
 * The field keeps the author's choice — a select that snaps back inside the same frame reads
 * as a dead control — and the option goes `disabled` once the beat is up, so the control ends
 * the interaction saying plainly that it is not on offer.
 *
 * ⚠️ ~100ms is a floor, not a target, and nothing in the suite enforces it. Below that a change
 * reads as simultaneous with the click, so the disable stops reading as an answer and starts
 * reading as "this was always unavailable". 200 leaves headroom for the native popup's closing
 * animation. Cycle Block measured it (2026-08-25); the E2E polls for the end state.
 */
const REFUSAL_DELAY = 200;

/**
 * The convention's Upsell select, as state: Penpot → WordPress > Plugins → *Upsell surfaces —
 * the convention*, pattern 1. Ported from Cycle Block's `CycleSettings`.
 *
 * 🔴 **The value never reaches the block.** A locked pick returns before `onChange` is called,
 * so `setAttributes` never sees it. That is the editor half; `AttributeGate` and the render are
 * the halves that survive this file being edited, and they clamp on read, so a stored value
 * survives a downgrade and works again after an upgrade.
 *
 * @param {Object}   args
 * @param {string}   args.stored   The block's own value.
 * @param {Function} args.isLocked Whether this build may not use a value.
 * @param {Function} args.onChange Writes an allowed value to the block.
 * @return {Object} What the select and its notice render from.
 */
const useRefusal = ({
  stored,
  isLocked,
  onChange
}) => {
  /**
   * The locked value the author chose, which the field goes on showing.
   *
   * ⚠️ The *display*, never the block. While it is set the control shows a value the block
   * does not have, and the only thing saying so is the notice — so the notice is not optional.
   */
  const [pending, setPending] = (0,external_wp_element_namespaceObject.useState)(null);

  /**
   * The one locked value currently refused, or null. **One, never a list**: an author who
   * tried three styles to see what they were would otherwise be left with a control full of
   * dead entries and no way to ask about any of them again.
   */
  const [refused, setRefused] = (0,external_wp_element_namespaceObject.useState)(null);

  /**
   * The one notice, or null: `{ picked, isStored }`. Seeded from the attribute, so a block
   * that already holds a locked value — a downgraded site — is told on arrival rather than
   * only if it happens to reopen the select.
   */
  const [notice, setNotice] = (0,external_wp_element_namespaceObject.useState)(() => isLocked(stored) ? {
    picked: stored,
    isStored: true
  } : null);
  const timer = (0,external_wp_element_namespaceObject.useRef)(null);

  // The timeout outlives the component if the block is deselected inside the beat.
  (0,external_wp_element_namespaceObject.useEffect)(() => () => clearTimeout(timer.current), []);

  /**
   * Whether the author reached the control with a pointer. ⚠️ Not `:focus-visible`: Chrome
   * reports it true for a `<select>` after a plain mouse click. Observed directly instead.
   */
  const pointerDriven = (0,external_wp_element_namespaceObject.useRef)(false);

  /**
   * Let the field go once the offer is withdrawn, so it stops holding a focus ring around a
   * value it no longer claims.
   *
   * 🔴 **Pointer authors only.** For a keyboard author the ring is their cursor: blurring
   * sends focus to `<body>` and the next Tab restarts at the top of the document (WCAG 2.4.3).
   *
   * @param {HTMLSelectElement|null} field The select the author used.
   */
  const releaseFocus = field => {
    if (!pointerDriven.current) {
      return;
    }
    if (!field || field.ownerDocument.activeElement !== field) {
      return;
    }
    field.blur();
  };
  const refuse = (value, field) => {
    setPending(value);
    // A block already holding a locked value is not running the one it holds either, so
    // a locked-to-locked swap takes the downgraded wording.
    setNotice({
      picked: value,
      isStored: isLocked(stored)
    });
    setRefused(null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRefused(value);
      releaseFocus(field);
    }, REFUSAL_DELAY);
  };
  const handleChange = (value, extra) => {
    // `SelectControl` hands the change event through its second argument. Only ever used
    // to hand focus back (`releaseFocus`); without it, focus is simply left alone.
    const field = extra?.event?.target ?? null;

    // ⚠️ The value must not reach the block. See the docblock above.
    if (isLocked(value)) {
      refuse(value, field?.tagName === 'SELECT' ? field : null);
      return;
    }
    clearTimeout(timer.current);
    setPending(null);
    setNotice(null);
    setRefused(null);
    onChange(value);
  };
  return {
    value: pending ?? stored,
    refused,
    notice,
    dismiss: () => setNotice(null),
    onChange: handleChange,
    // True only once the beat is up, so the click lands at full strength first.
    showingRefused: refused !== null && pending === refused,
    pointerHandlers: {
      onPointerDownCapture: () => {
        pointerDriven.current = true;
      },
      onKeyDownCapture: () => {
        pointerDriven.current = false;
      }
    }
  };
};
;// ./src/blocks/serendipity/_components/UpsellNotice.jsx



/**
 * The convention's notice: a claim, the facts behind it, and one link.
 *
 * Core's `Notice`, with GhostLabs purple on its border and nowhere else
 * (`.ghostlabs-serendipity-upsell-notice` in `editor.scss`). ⚠️ The link carries no color of
 * its own: it inherits WordPress's blue and follows the site's admin color scheme.
 *
 * 🔴 **No fallback link.** `url` comes from the map PHP inlines; where it is null — any edition
 * with nothing to sell — the copy stands on its own and no link renders.
 *
 * @param {Object}      props
 * @param {string}      props.title      The claim, in bold.
 * @param {string[]}    props.lines      What is true, in plain text.
 * @param {string|null} props.url        The finished upgrade URL, or null.
 * @param {Function}    [props.onRemove] Dismisses it; omitted for a notice that stays.
 * @param {boolean}     [props.announce] Speak it politely. A refusal is announced, because
 *                                       the field displays a value the block does not have
 *                                       and a screen-reader user has no other signal. A
 *                                       standing panel notice is not.
 * @return {Element} The notice.
 */

const UpsellNotice = ({
  title,
  lines,
  url,
  onRemove,
  announce = true
}) => /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.Notice, {
  className: "ghostlabs-serendipity-upsell-notice",
  status: "info",
  politeness: "polite",
  isDismissible: typeof onRemove === 'function',
  onRemove: onRemove
  // The rendered children are separate nodes and a link; spoken as one sentence they
  // read as one answer. An empty string is how core is told to say nothing at all.
  ,
  spokenMessage: announce ? [title, ...lines].join(' ') : '',
  children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("p", {
    children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("strong", {
      children: title
    })
  }), lines.length > 0 && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("p", {
    children: lines.join(' ')
  }), url && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("p", {
    children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ExternalLink, {
      href: url,
      children: (0,external_wp_i18n_namespaceObject.__)('See Serendipity Deluxe', 'ghostlabs-serendipity')
    })
  })]
});
/* harmony default export */ const _components_UpsellNotice = (UpsellNotice);
;// ./src/blocks/serendipity/_components/RefusableSelect.jsx





/**
 * A select whose locked options answer the click (the convention's Upsell select).
 *
 * Every option is offered. Choosing a locked one leaves the block alone, keeps the pick in the
 * field, explains it in a notice that names what is still in effect, and disables that one
 * option a beat later. Choosing an allowed one writes it and clears everything. A block that
 * already holds a locked value shows the notice on arrival.
 *
 * ⚠️ Color is emphasis, never the signal (WCAG 1.4.1): the dimmed field is styling, and the
 * notice's words carry the meaning.
 *
 * @param {Object}   props
 * @param {string}   props.label    The control's label.
 * @param {string}   props.stored   The block's value.
 * @param {Function} props.options  `( refused ) => options`.
 * @param {Function} props.isLocked Whether this build may not use a value.
 * @param {Function} props.copy     `( notice ) => { title, lines, url }`.
 * @param {Function} props.onChange Writes an allowed value to the block.
 * @param {Function} [props.help]   `( value ) => help text`, for the value the block has.
 * @return {Element} The select, and its notice when there is one.
 */

const RefusableSelect = ({
  label,
  stored,
  options,
  isLocked,
  copy,
  onChange,
  help
}) => {
  const refusal = useRefusal({
    stored,
    isLocked,
    onChange
  });
  const wrapper = (0,external_wp_element_namespaceObject.useRef)(null);

  // ⚠️ Dismissing unmounts the notice's button with focus on it, and focus fell to <body>:
  // the next Tab started from the top of the document (accessibility audit, 2026-10-16). It
  // goes back to the field the notice was about.
  const dismiss = () => {
    refusal.dismiss();
    wrapper.current?.querySelector('select')?.focus();
  };

  // ⚠️ One wrapper, carrying the panel's rhythm itself. Core spaces controls with a margin
  // on a `.components-base-control` that is a DIRECT child of the panel; wrapping the select
  // took that away and left the next control flush against it (measured 0px, 2026-10-11).
  // `.ghostlabs-serendipity-refusable` in editor.scss gives the 16px back.
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", {
    className: "ghostlabs-serendipity-refusable",
    ref: wrapper,
    children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("div", {
      ...refusal.pointerHandlers,
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.SelectControl, {
        label: label,
        className: refusal.showingRefused ? 'ghostlabs-serendipity-select--refused' : undefined,
        value: refusal.value,
        options: options(refusal.refused),
        help: help ? help(stored) : undefined,
        onChange: refusal.onChange,
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      })
    }), refusal.notice && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
      marginTop: 4,
      marginBottom: 0,
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_UpsellNotice, {
        ...copy(refusal.notice),
        onRemove: dismiss
      })
    })]
  });
};
/* harmony default export */ const _components_RefusableSelect = (RefusableSelect);
;// ./src/blocks/serendipity/_lib/_blockUtils.js

const hasLayout = ({
  deviceType,
  layoutData
}) => {
  if (!layoutData) {
    return false;
  }
  return layoutData.find(item => item.deviceType === deviceType) !== undefined;
};

/**
 * Whether a breakpoint's saved layout still fits the gallery: one rectangle per image.
 *
 * `hasLayout()` answers "is there one at all", which is what Reset needs — a stale layout is
 * exactly what it clears. The "saved" indicator needs this: a layout whose count no longer
 * matches is discarded by both resolvers, so the gallery recomposes on every load, and calling
 * it saved told the author the opposite of what was happening.
 *
 * @param {Object}          args
 * @param {Array|undefined} args.layoutData The block's saved layouts.
 * @param {string}          args.deviceType The breakpoint.
 * @param {number}          args.imageCount How many images the gallery has.
 * @return {boolean} True when that breakpoint's layout is saved and still fits.
 */
const isLayoutCurrent = ({
  layoutData,
  deviceType,
  imageCount
}) => (layoutData ?? []).some(item => item?.deviceType === deviceType && (item?.rectangles?.length ?? 0) > 0 && item.rectangles.length === imageCount);

// export const isLayoutSaved = (layout, deviceType) => layout.find(item => item.deviceType === deviceType) !== undefined;
const isLayoutSaved = hasLayout;
const getLayout = ({
  layoutData,
  deviceType
}) => layoutData.find(item => item.deviceType === deviceType);
const isBlockIdReserved = blockId => {
  const blocks = (0,external_wp_data_namespaceObject.select)('core/block-editor').getBlocksByName('ghostlabs/serendipity');
  const test = blocks.reduce((a, clientId) => {
    const attributes = (0,external_wp_data_namespaceObject.select)('core/block-editor').getBlockAttributes(clientId);
    if (attributes?.id === blockId) {
      a.push(attributes.id);
    }
    return a;
  }, []);
  return test.length > 1;
};

/**
 * Select a freshly inserted gallery, and show it in the List View.
 *
 * ⚠️ Both dispatches below go to the **global** registry rather than to whichever block
 * editor is rendering this block, and that difference is not academic. Inserter pattern
 * previews render our block inside their own sub-registry; one that ran this reached past
 * itself, selected a clientId the real editor has never heard of, and forced the real
 * editor's List View open. List View and the inserter share the same sidebar slot — so
 * opening one closes the other, and the Serendipity pattern category emptied itself the
 * instant it was opened. Four previews, four dispatches, no error in the console: the
 * category simply showed nothing, on a listing that advertises four starter patterns.
 *
 * A block the global store has never seen is a block in somebody else's editor. There is
 * nothing here for it to select, and nothing of the user's to open.
 *
 * @param {string} clientId The block being inserted.
 */
const selectBlock = clientId => {
  if (!wp.data.select('core/block-editor').getBlock(clientId)) {
    return;
  }
  wp.data.dispatch('core/block-editor').selectBlock(clientId);
  const isListViewOpened = wp.data.select('core/editor').isListViewOpened();
  if (!isListViewOpened) {
    wp.data.dispatch('core/editor').setIsListViewOpened(true);
  }
};
const setTarget = e => {
  const parent = e.target.closest('.ghostlabs-serendipity__gallery-item');
  return parent.querySelector('img');
};
;// ./src/blocks/serendipity/_components/GalleryInspectorControls.jsx
/**
 * WordPress dependencies
 */









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

const GalleryInspectorControls = ({
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
  onDebug
}) => {
  const gapValue = parseInt(gap, 10) || 1;

  // A saved breakpoint carries its own height; an unsaved one shows the attribute's.
  const layout = getLayout({
    deviceType,
    layoutData
  });
  const minHeightValue = parseInt(layout?.minHeight ?? minHeight, 10) || 360;
  const imageSizes = (0,external_wp_data_namespaceObject.select)('core/block-editor').getSettings().imageSizes;
  const thumbnailSizes = imageSizes.map(({
    slug,
    name
  }) => ({
    label: name,
    value: slug
  }));
  const imageResolutions = imageSizes.map(({
    slug,
    name
  }) => ({
    label: name,
    value: slug
  })).filter(({
    value
  }) => value !== 'thumbnail');

  // From the attribute, not a constant: this used to start at 'medium' whatever the
  // block said, so a pattern inserted with 'large' showed Medium in the sidebar.
  const thumbnailSizeValue = thumbnailSize || 'medium';
  const lightboxValue = lightbox || (carousel ? LIGHTBOX.BUILT_IN : LIGHTBOX_DEFAULT);
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_blockEditor_namespaceObject.InspectorControls, {
    children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('Layout Settings', 'ghostlabs-serendipity'),
      children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.RangeControl, {
        label: (0,external_wp_i18n_namespaceObject.__)('Gap Size (px)', 'ghostlabs-serendipity'),
        value: gapValue,
        onChange: value => onChangeGap(`${value}px`),
        min: 1,
        max: 10,
        step: 1,
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.RangeControl, {
        label: (0,external_wp_i18n_namespaceObject.__)('Minimum Height (px)', 'ghostlabs-serendipity'),
        value: minHeightValue,
        onChange: value => onChangeMinHeight(`${value}px`),
        min: 360,
        max: 720,
        step: 1,
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
        marginTop: -2,
        marginBottom: 8,
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalText, {
          size: "14",
          variant: 'muted',
          children: (0,external_wp_i18n_namespaceObject.__)(`Set a minimum display height for the tiled gallery.`, 'ghostlabs-serendipity')
        })
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.SelectControl, {
        label: (0,external_wp_i18n_namespaceObject.__)('Thumbnail resolution', 'ghostlabs-serendipity'),
        value: thumbnailSizeValue,
        options: thumbnailSizes,
        onChange: onThumbnailSize,
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_RefusableSelect, {
        label: (0,external_wp_i18n_namespaceObject.__)('Hover Styles', 'ghostlabs-serendipity'),
        stored: hoverStyle,
        options: hoverStyleOptions,
        isLocked: isLockedHoverStyle,
        copy: notice => hoverRefusalCopy({
          ...notice,
          running: hoverRunning(hoverStyle)
        }),
        onChange: onHoverStyle
      }), deviceType === 'Mobile' ? /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
        marginTop: 6,
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.CheckboxControl, {
          __nextHasNoMarginBottom: true,
          label: (0,external_wp_i18n_namespaceObject.__)('Stack on Mobile', 'ghostlabs-serendipity'),
          help: (0,external_wp_i18n_namespaceObject.__)('Stack thumbnails on mobile?', 'ghostlabs-serendipity'),
          checked: mobileStackThumbnails,
          onChange: onMobileStackThumbnails
        })
      }) : '', /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.Flex, {
        direction: 'column',
        children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalText, {
          children: (0,external_wp_i18n_namespaceObject.__)('Layout', 'ghostlabs-serendipity')
        }), isLayoutCurrent({
          deviceType,
          layoutData,
          imageCount
        }) ? /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.Button, {
          variant: "secondary",
          onClick: onRefreshLayout,
          style: {
            justifyContent: 'center'
          },
          children: (0,external_wp_i18n_namespaceObject.__)('Refresh Layout', 'ghostlabs-serendipity')
        }) : /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.Button, {
          variant: "primary",
          onClick: onSaveLayout,
          style: {
            justifyContent: 'center'
          },
          children: (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: device type (Desktop, Tablet, Mobile) */
          (0,external_wp_i18n_namespaceObject.__)('Save %s Layout', 'ghostlabs-serendipity'), deviceType)
        })]
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
        marginTop: 10,
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.CheckboxControl, {
          __nextHasNoMarginBottom: true,
          label: (0,external_wp_i18n_namespaceObject.__)('Debug', 'ghostlabs-serendipity'),
          help: (0,external_wp_i18n_namespaceObject.__)('Enable debug if encountering issues.', 'ghostlabs-serendipity'),
          checked: debug,
          onChange: onDebug
        })
      })]
    }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('Lightbox Settings', 'ghostlabs-serendipity')
      // Keyed off the stored value, which a refusal never writes: a block that holds
      // the carousel opens here so its notice is seen; a refusal does not reopen it.
      ,
      initialOpen: lightboxValue === LIGHTBOX.BUILT_IN,
      children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
        marginTop: 8,
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_RefusableSelect, {
          label: (0,external_wp_i18n_namespaceObject.__)('Lightbox', 'ghostlabs-serendipity'),
          stored: lightboxValue,
          options: lightboxOptions,
          isLocked: isLockedLightbox,
          copy: notice => lightboxRefusalCopy({
            ...notice,
            running: lightboxRunning(lightboxValue)
          })
          // The help describes the mode in effect: a locked carousel renders as
          // "Your lightbox plugin", so explaining the carousel here would describe
          // something this site does not do.
          ,
          help: value => lightboxHelp(lightboxRunning(value)),
          onChange: onLightbox
        })
      }), lightboxValue === LIGHTBOX.BUILT_IN && !isLockedLightbox(lightboxValue) && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_ReactJSXRuntime_namespaceObject.Fragment, {
        children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
          marginTop: 6,
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.SelectControl, {
            label: (0,external_wp_i18n_namespaceObject.__)('Image Resolution', 'ghostlabs-serendipity'),
            help: (0,external_wp_i18n_namespaceObject.__)('The size each photograph opens at in the carousel.', 'ghostlabs-serendipity'),
            value: imageResolution,
            options: imageResolutions,
            onChange: onImageResolution,
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true
          })
        }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
          marginTop: 6,
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.RadioControl, {
            label: (0,external_wp_i18n_namespaceObject.__)('Carousel Controls', 'ghostlabs-serendipity'),
            help: (0,external_wp_i18n_namespaceObject.__)('Choose which additional controls to display in the carousel.', 'ghostlabs-serendipity'),
            selected: controls,
            options: [{
              label: (0,external_wp_i18n_namespaceObject.__)('Dot Navigation', 'ghostlabs-serendipity'),
              value: 'dot-navigation'
            }, {
              label: (0,external_wp_i18n_namespaceObject.__)('Snap Display', 'ghostlabs-serendipity'),
              value: 'snap-display'
            }, {
              label: (0,external_wp_i18n_namespaceObject.__)('None', 'ghostlabs-serendipity'),
              value: 'none'
            }],
            onChange: onControls
          })
        }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
          marginTop: 3,
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.CheckboxControl, {
            __nextHasNoMarginBottom: true,
            label: (0,external_wp_i18n_namespaceObject.__)('Show carousel captions', 'ghostlabs-serendipity'),
            help: (0,external_wp_i18n_namespaceObject.__)('Enable captions to be displayed on carousel', 'ghostlabs-serendipity'),
            checked: showCarouselCaptions,
            onChange: onShowCarouselCaptions
          })
        }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
          marginTop: 3,
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.CheckboxControl, {
            __nextHasNoMarginBottom: true,
            label: (0,external_wp_i18n_namespaceObject.__)('Play as a slideshow', 'ghostlabs-serendipity'),
            help: (0,external_wp_i18n_namespaceObject.__)('Advance on its own until the visitor takes over. Ignored for anyone who has asked for reduced motion.', 'ghostlabs-serendipity'),
            checked: autoplay,
            onChange: onAutoplay
          })
        }), autoplay && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.__experimentalSpacer, {
          marginTop: 3,
          children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.RangeControl, {
            __nextHasNoMarginBottom: true,
            label: (0,external_wp_i18n_namespaceObject.__)('Seconds per slide', 'ghostlabs-serendipity'),
            value: autoplayDelay,
            min: 2,
            max: 15,
            step: 1,
            onChange: onAutoplayDelay
          })
        })]
      })]
    })]
  });
};
/* harmony default export */ const _components_GalleryInspectorControls = (GalleryInspectorControls);
;// ./src/blocks/serendipity/_components/LayoutStudioSeat.jsx








const STUDIO_READY = 'ghostlabs-serendipity/studio-ready';

/**
 * A seat for Layout Studio, which every edition renders and only one fills.
 *
 * The block is built once, from `shared/`, and ships to both editions — so the studio
 * cannot be imported here without putting the licensed editor into the free build. It
 * arrives instead as its own script, which the licensed edition enqueues and which
 * assigns itself to a global. This looks for it, and renders nothing when it is absent.
 *
 * The capability is checked as well as the global, and deliberately not only the global:
 * a license that has lapsed since the page loaded, or a script served from a stale cache,
 * would otherwise hand the studio to a build that is no longer entitled to it. Absent
 * means not entitled — see `_lib/capabilities`.
 *
 * @param {Object} props Passed straight through to the studio.
 * @return {Element|null} The studio, where there is one.
 */
const LayoutStudioSeat = props => {
  const [Studio, setStudio] = (0,external_wp_element_namespaceObject.useState)(() => window.GhostLabsSerendipity?.LayoutStudio ?? null);
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    if (Studio) {
      return;
    }

    // The enhancement may load after this has already rendered empty, so it
    // announces itself rather than waiting to be noticed.
    const onReady = () => setStudio(() => window.GhostLabsSerendipity?.LayoutStudio ?? null);
    window.addEventListener(STUDIO_READY, onReady);
    return () => window.removeEventListener(STUDIO_READY, onReady);
  }, [Studio]);
  if (!Studio || !hasCapability(CAPABILITY.LAYOUT_STUDIO)) {
    // Shown, not hidden: someone who never sees that seams and reframing exist has
    // no reason to want them. One panel, closed by default because the inspector holds
    // the controls the author came for (the convention's Upsell panel), and nothing
    // else — no modal, no badge on the toolbar.
    //
    // ⚠️ The notice is not dismissible and says nothing aloud (`announce={ false }`):
    // it is the panel's standing content, read when the author opens the panel, not a
    // response to anything they did.
    return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_blockEditor_namespaceObject.InspectorControls, {
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.PanelBody, {
        title: (0,external_wp_i18n_namespaceObject.__)('Layout Studio', 'ghostlabs-serendipity'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("p", {
          children: (0,external_wp_i18n_namespaceObject.__)('Drag the seams between tiles to resize them, drag a photograph within its tile to reframe it, and drag one tile onto another to swap the two.', 'ghostlabs-serendipity')
        }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_UpsellNotice, {
          title: sellsUpgrade() ? (0,external_wp_i18n_namespaceObject.__)('Layout Studio is in Serendipity Deluxe.', 'ghostlabs-serendipity') : (0,external_wp_i18n_namespaceObject.__)('Layout Studio needs an active Serendipity Deluxe license.', 'ghostlabs-serendipity'),
          lines: sellsUpgrade() ? [(0,external_wp_i18n_namespaceObject.__)('Your galleries and saved layouts carry over unchanged.', 'ghostlabs-serendipity')] : [],
          url: upgradeUrl(UPSELL.LAYOUT_STUDIO),
          announce: false
        })]
      })
    });
  }

  // Reframing is its own capability. Both are granted by the same license today, but
  // the studio should not assume that — the split exists so the tiers can move.
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(Studio, {
    ...props,
    canReframe: hasCapability(CAPABILITY.PAN_TILT)
  });
};
/* harmony default export */ const _components_LayoutStudioSeat = (LayoutStudioSeat);
;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/desktop.mjs
// packages/icons/src/library/desktop.tsx


var desktop_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z" }) });

//# sourceMappingURL=desktop.mjs.map

;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/tablet.mjs
// packages/icons/src/library/tablet.tsx


var tablet_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z" }) });

//# sourceMappingURL=tablet.mjs.map

;// ./node_modules/.pnpm/@wordpress+icons@11.8.0_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react@18.3_0f1ad27c37fbfbf6826a9d421e0363cc/node_modules/@wordpress/icons/build-module/library/mobile.mjs
// packages/icons/src/library/mobile.tsx


var mobile_default = /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, { d: "M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z" }) });

//# sourceMappingURL=mobile.mjs.map

;// ./src/blocks/serendipity/_components/DeviceSwitcher.jsx






const DEVICES = [{
  type: 'Desktop',
  icon: desktop_default,
  label: (0,external_wp_i18n_namespaceObject.__)('Desktop', 'ghostlabs-serendipity')
}, {
  type: 'Tablet',
  icon: tablet_default,
  label: (0,external_wp_i18n_namespaceObject.__)('Tablet', 'ghostlabs-serendipity')
}, {
  type: 'Mobile',
  icon: mobile_default,
  label: (0,external_wp_i18n_namespaceObject.__)('Mobile', 'ghostlabs-serendipity')
}];

/**
 * The breakpoint being composed for, in the block's own toolbar.
 *
 * Layouts are saved per breakpoint, and the only way to change breakpoint was the
 * Preview menu in the editor header — a control most people never associate with the
 * gallery they are editing, three clicks away from the block that depends on it. This
 * puts it on the block, where the consequence is.
 *
 * It dispatches to `core/editor`, the same store the header control writes to, so the
 * two are the same setting rather than two settings that agree most of the time.
 *
 * Saved is marked by a check badge on the glyph's corner (`editor.scss`; owner, 2026-10-13
 * — it replaced a purple fill that read as pressed and vanished on the current device).
 * The badge is a shape, not a color, and each button also says which it is, so the
 * distinction survives grayscale, color blindness and a screen reader.
 *
 * All three breakpoints are free (§A.4). A gallery whose layout is only saved at one
 * width regenerates at random everywhere else, which would make a free tier look broken
 * rather than limited.
 *
 * @param {Object}        props
 * @param {string}        props.deviceType The breakpoint being edited.
 * @param {Array<Object>} props.layoutData The block's saved layouts.
 * @param {number}        props.imageCount How many images the gallery has.
 * @return {Element} The toolbar group.
 */
const DeviceSwitcher = ({
  deviceType,
  layoutData,
  imageCount
}) => {
  const editor = (0,external_wp_data_namespaceObject.useDispatch)('core/editor');
  const setDevice = type => {
    // `setDeviceType` since WP 6.5; the experimental name is what older editors
    // answer to, and dropping the call entirely would leave a dead button.
    const setter = editor?.setDeviceType ?? editor?.__experimentalSetPreviewDeviceType;
    setter?.(type);
  };

  // Saved only while it still fits: a layout whose tile count no longer matches the
  // images is discarded on load, so it is not "saved" in any sense the author cares about.
  const isSaved = type => isLayoutCurrent({
    layoutData,
    deviceType: type,
    imageCount
  });
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ToolbarGroup, {
    children: DEVICES.map(({
      type,
      icon,
      label
    }) => {
      const saved = isSaved(type);

      // ⚠️ The name is the breakpoint and never changes; whether a layout is saved is the
      // description. A name that carried the state ("Desktop — layout saved") changed
      // when a layout was saved (accessibility audit, 2026-10-16, #26). For an
      // icon-only button the tooltip IS the name, so the tooltip is set apart to keep
      // saying both, and a sighted pointer user loses nothing (owner's pick 4 B,
      // 2026-10-17). The name is contained in the tooltip, as 2.5.3 asks.
      const tooltip = saved ? (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: a breakpoint — Desktop, Tablet or Mobile. */
      (0,external_wp_i18n_namespaceObject.__)('%s — layout saved', 'ghostlabs-serendipity'), label) : (0,external_wp_i18n_namespaceObject.sprintf)(/* translators: %s: a breakpoint — Desktop, Tablet or Mobile. */
      (0,external_wp_i18n_namespaceObject.__)('%s — no layout saved yet', 'ghostlabs-serendipity'), label);
      return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.Tooltip, {
        text: tooltip,
        children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ToolbarButton, {
          icon: icon,
          isActive: deviceType === type,
          className: `ghostlabs-serendipity-toolbar__device${saved ? ' ghostlabs-serendipity-toolbar__device--saved' : ''}`,
          label: label,
          showTooltip: false,
          description: saved ? (0,external_wp_i18n_namespaceObject.__)('Layout saved', 'ghostlabs-serendipity') : (0,external_wp_i18n_namespaceObject.__)('No layout saved yet', 'ghostlabs-serendipity'),
          onClick: () => setDevice(type)
        })
      }, type);
    })
  });
};
/* harmony default export */ const _components_DeviceSwitcher = (DeviceSwitcher);
;// ./src/blocks/serendipity/edit.js
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */







/**
 * Internal dependencies
 */










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
function Edit({
  attributes,
  setAttributes,
  clientId,
  isSelected
}) {
  /**
   * Returns the current deviceType.
   */
  const deviceType = (0,external_wp_data_namespaceObject.useSelect)(select => select('core/editor').getDeviceType());
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
    autoplayDelay
  } = attributes;
  const [gallery, setGallery] = (0,external_wp_element_namespaceObject.useState)(null);
  const [aspectRatio, setAspectRatio] = (0,external_wp_element_namespaceObject.useState)('auto');
  const [, setLayoutSaved] = (0,external_wp_element_namespaceObject.useState)(isLayoutSaved({
    layoutData,
    deviceType
  }));
  const [recompose, setRecompose] = (0,external_wp_element_namespaceObject.useState)({
    count: 0,
    mode: null,
    deviceType: null
  });

  // The `layoutData` the canvas agrees with: the one it was last composed from, or the
  // one this component last wrote to match it. A value arriving in the attribute that is
  // neither came from outside — undo, redo — and the canvas is recomposed from it below.
  const canvasLayoutData = (0,external_wp_element_namespaceObject.useRef)(layoutData);

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
  const writeAttributes = changes => {
    if ('layoutData' in changes) {
      canvasLayoutData.current = changes.layoutData;
    }
    setAttributes(changes);
  };
  const handleChange = (key, value) => writeAttributes({
    [key]: value
  });

  // Generate a unique ID for the gallery if one doesn't exist
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    const newGalleryId = `${GALLERY_ID_PREFIX}-${clientId.slice(0, 8)}`;
    if (!id) {
      handleChange('id', newGalleryId);
      selectBlock(clientId);
      return;
    }
    if (isBlockIdReserved(id)) {
      handleChange('id', newGalleryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, clientId]);

  // Check parent block alignment changes
  const parentBlockClientId = (0,external_wp_data_namespaceObject.useSelect)(select => select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/group')[0]);
  const parentBlockAttributes = (0,external_wp_data_namespaceObject.useSelect)(select => parentBlockClientId ? select('core/block-editor').getBlockAttributes(parentBlockClientId) : null, [parentBlockClientId]);

  // Fetch full image data for any images that might be missing details
  const imageIds = rawImages.map(img => img.id).filter(Boolean);
  const mediaData = (0,external_wp_data_namespaceObject.useSelect)(select => {
    if (!imageIds.length) {
      return [];
    }
    return select(external_wp_coreData_namespaceObject.store).getEntityRecords('postType', 'attachment', {
      include: imageIds,
      per_page: imageIds.length
    });
  }, [imageIds]);

  // Merge media data with our existing images if needed
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    if (mediaData && mediaData.length > 0) {
      const updatedImages = rawImages.map(image => {
        if (!image.id) {
          return image;
        }
        const mediaItem = mediaData.find(media => media.id === image.id);
        if (mediaItem) {
          return {
            ...image,
            url: mediaItem?.source_url || image.url,
            alt: image.alt || mediaItem.alt_text || '',
            caption: image.caption || mediaItem.caption?.raw || ''
          };
        }
        return image;
      });
      if (JSON.stringify(updatedImages) !== JSON.stringify(rawImages)) {
        // setAttributes({ rawImages: updatedImages });
        handleChange('rawImages', updatedImages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaData, rawImages]);

  // Block props for the outer wrapper
  const blockProps = (0,external_wp_blockEditor_namespaceObject.useBlockProps)({
    className: 'serendipity-gallery-block',
    'data-gallery-id': id
  });

  // Update images from media library
  const updateImages = newImages => {
    handleChange('rawImages', newImages);
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
  const removeImage = image => {
    handleChange('rawImages', rawImages.filter(candidate => candidate !== image));
  };

  // Update gap between images
  const updateGap = newGap => {
    handleChange('gap', newGap);
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
  const updateMinHeight = newMinHeight => {
    writeAttributes({
      minHeight: newMinHeight,
      ...(hasLayout({
        deviceType,
        layoutData
      }) && {
        layoutData: layoutData.map(datum => datum.deviceType === deviceType ? {
          ...datum,
          minHeight: newMinHeight
        } : datum)
      })
    });
  };

  /**
   * The mode, and the legacy boolean older saved blocks still carry, kept in step rather
   * than leaving a stale `true` behind for the render to resolve. One write, so one undo
   * step: as two, undoing once left a block with the built-in carousel both on and off.
   *
   * @param {string} value One of LIGHTBOX.
   */
  const updateLightbox = value => {
    writeAttributes({
      lightbox: value,
      carousel: value === LIGHTBOX.BUILT_IN
    });
  };
  const setDebug = value => {
    handleChange('debug', value);
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
  const writeLayout = (composed, composedRatio) => {
    const rawLayoutData = composed.getLayoutData();
    handleChange('layoutData', withLayout(layoutData, deviceType, {
      deviceType,
      aspectRatio: composedRatio,
      rawLayoutData,
      rectangles: rawLayoutData.rectangles,
      minHeight
    }));
    setLayoutSaved(true);
  };
  const saveLayout = () => writeLayout(gallery, aspectRatio);

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
  const updateRectangles = rectangles => {
    const existing = layoutData.find(datum => datum.deviceType === deviceType);
    const updated = existing ? layoutData.map(datum => datum.deviceType === deviceType ? {
      ...datum,
      rectangles
    } : datum) : [...layoutData, {
      deviceType,
      aspectRatio,
      rawLayoutData: [],
      rectangles,
      minHeight
    }];
    handleChange('layoutData', updated);
    setLayoutSaved(true);
  };
  const resetLayout = () => {
    const tmp = layoutData.filter(datum => datum.deviceType !== deviceType);
    handleChange('layoutData', tmp);
    setLayoutSaved(false);
  };
  const updateThumbnailSize = newSize => {
    handleChange('thumbnailSize', newSize);
  };
  const updateMobileStackThumbnails = value => {
    handleChange('mobileStackThumbnails', value);
  };
  const updateImageResolution = newSize => {
    handleChange('imageResolution', newSize);
  };
  const updateHoverStyle = newHoverStyle => {
    handleChange('hoverStyle', newHoverStyle);
  };
  const updateControls = newControls => {
    handleChange('controls', newControls);
  };
  const updateShowCarouselCaptions = value => {
    handleChange('showCarouselCaptions', value);
  };
  const updateAutoplay = value => {
    handleChange('autoplay', value);
  };
  const updateAutoplayDelay = value => {
    handleChange('autoplayDelay', value);
  };

  /**
   * Ask the canvas to recompose this breakpoint. The attribute changes only once the
   * new composition is on screen, in `composed()` below — see `COMPOSE`.
   *
   * @param {string} mode One of COMPOSE.
   */
  const requestComposition = mode => {
    setRecompose(({
      count
    }) => ({
      count: count + 1,
      mode,
      deviceType
    }));
  };

  // The attribute changed underneath the canvas — see `canvasLayoutData`.
  (0,external_wp_element_namespaceObject.useEffect)(() => {
    if (layoutData === canvasLayoutData.current) {
      return;
    }
    canvasLayoutData.current = layoutData;
    requestComposition(COMPOSE.FOLLOW);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutData]);

  /**
   * A requested composition has reached the canvas.
   *
   * @param {Object} composition
   * @param {Object} composition.gallery     The instance just composed.
   * @param {string} composition.aspectRatio The aspect ratio it was composed at.
   * @param {string} composition.mode        What was asked for.
   */
  const composed = ({
    gallery: composedGallery,
    aspectRatio: composedRatio,
    mode
  }) => {
    if (mode === COMPOSE.REFRESH_AND_SAVE) {
      writeLayout(composedGallery, composedRatio);
      return;
    }

    // A refresh is left for the author to save; a reset is unsaved by definition.
    // Either way the saved entry would now describe something the canvas no longer
    // shows, and "Save" appearing in its place is what tells the author so.
    if (mode === COMPOSE.REFRESH || mode === COMPOSE.RESET) {
      resetLayout();
    }
  };
  return /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_GalleryInspectorControls, {
      carousel: carousel,
      lightbox: lightbox,
      controls: controls,
      debug: debug,
      gap: gap,
      id: id,
      deviceType: deviceType,
      layoutData: layoutData,
      imageCount: rawImages.length,
      hoverStyle: hoverStyle,
      minHeight: minHeight,
      imageResolution: imageResolution,
      thumbnailSize: thumbnailSize,
      showCarouselCaptions: showCarouselCaptions,
      autoplay: autoplay,
      autoplayDelay: autoplayDelay,
      onAutoplay: updateAutoplay,
      onAutoplayDelay: updateAutoplayDelay,
      mobileStackThumbnails: mobileStackThumbnails,
      onMobileStackThumbnails: updateMobileStackThumbnails,
      onImageResolution: updateImageResolution,
      onChangeGap: updateGap,
      onChangeMinHeight: updateMinHeight,
      onSaveLayout: saveLayout,
      onRefreshLayout: () => requestComposition(COMPOSE.REFRESH),
      onThumbnailSize: updateThumbnailSize,
      onHoverStyle: updateHoverStyle,
      onLightbox: updateLightbox,
      onControls: updateControls,
      onShowCarouselCaptions: updateShowCarouselCaptions,
      onDebug: setDebug
    }, 'ghostlabs-serendipity-gallery-inspector-controls'), rawImages.length > 0 ? /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_ReactJSXRuntime_namespaceObject.Fragment, {
      children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_GalleryGrid, {
        align: align,
        parentClientId: clientId,
        deviceType: deviceType,
        images: rawImages,
        onRemoveImage: removeImage,
        gap: gap,
        hoverStyle: hoverStyle,
        layoutData: layoutData,
        minHeight: minHeight,
        parentBlockClientId: parentBlockClientId,
        parentBlockAttributes: parentBlockAttributes,
        recompose: recompose,
        onComposed: composed,
        setGallery: setGallery,
        setAspectRatio: setAspectRatio
      }, 'ghostlabs-serendipity-gallery-grid'), isSelected && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_LayoutStudioSeat, {
        gallery: gallery,
        layoutData: layoutData,
        deviceType: deviceType,
        gap: gap,
        imageCount: rawImages.length,
        onChangeRectangles: updateRectangles
      })]
    }) : /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", {
      className: "serendipity-gallery-block__empty-gallery-placeholder",
      children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("p", {
        children: (0,external_wp_i18n_namespaceObject.__)('Add images to create your gallery', 'ghostlabs-serendipity')
      }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_MediaUploadControl, {
        images: rawImages,
        onUpdateImages: updateImages
      })]
    }, 'ghostlabs-serendipity-media-upload-control'), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_blockEditor_namespaceObject.BlockControls, {
      children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", {
        className: "components-accessible-toolbar ghostlabs-serendipity-toolbar",
        children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_DeviceSwitcher, {
          deviceType: deviceType,
          layoutData: layoutData,
          imageCount: rawImages.length
        }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_wp_components_namespaceObject.ToolbarGroup, {
          children: [/*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(_components_MediaUploadControl, {
            images: rawImages,
            onUpdateImages: updateImages,
            toolbar: true
          }), /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ToolbarButton, {
            icon: update_default,
            label: (0,external_wp_i18n_namespaceObject.__)('Refresh Layout & Save', 'ghostlabs-serendipity'),
            onClick: () => requestComposition(COMPOSE.REFRESH_AND_SAVE)
          }), hasLayout({
            deviceType,
            layoutData
          }) && !isBlockIdReserved(id) && /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_components_namespaceObject.ToolbarButton, {
            icon: rotate_left_default,
            label: (0,external_wp_i18n_namespaceObject.__)('Reset Gallery Layout', 'ghostlabs-serendipity'),
            onClick: () => requestComposition(COMPOSE.RESET)
          })]
        })]
      })
    }, 'ghostlabs-serendipity-block-controls')]
  });
}
;// ./src/blocks/serendipity/block.json
const block_namespaceObject = /*#__PURE__*/JSON.parse('{"UU":"ghostlabs/serendipity"}');
;// ./src/blocks/serendipity/index.js
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Internal dependencies
 */



/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

(0,external_wp_blocks_namespaceObject.registerBlockType)(block_namespaceObject.UU, {
  /**
   * Drawn on the 24px WordPress icon grid so it sits on the same rhythm as the
   * core icons beside it in the block toolbar: outer frame 4–20, 1.5 border,
   * 1.5 gutters. The three fields are knocked out of the frame with evenodd,
   * so what stays inked is the border and the seams between them — the block
   * is a bounded area partition, and the mark is one.
   */
  icon: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false",
    children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5 4H19A1 1 0 0 1 20 5V19A1 1 0 0 1 19 20H5A1 1 0 0 1 4 19V5A1 1 0 0 1 5 4ZM5.5 5.5V18.5H9V5.5ZM10.5 5.5V11.25H18.5V5.5ZM10.5 12.75V18.5H18.5V12.75Z",
      fill: "currentColor"
    })
  }),
  /**
   * @see ./edit.js
   */
  edit: Edit
});
/******/ })()
;
(() => {
  // dev/javascript/_utils/tools.js
  var splitValueAndUnit = (value) => {
    const match = value.match(/^([\d.]+)([a-z%]*)$/i);
    if (!match) {
      return [0, ""];
    }
    return [parseFloat(match[1]), match[2]];
  };

  // dev/javascript/_lib/constants.js
  var GALLERY_ITEM_SELECTOR = ".ghostlabs-serendipity__gallery-item";
  var GALLERY_LOADING_CLASS = "ghostlabs-serendipity--gallery-loading";
  var GALLERY_LOADED_CLASS = "ghostlabs-serendipity--gallery-loaded";

  // dev/javascript/_lib/gutters.js
  var EPSILON = 0.01;
  var overlaps = (fromA, toA, fromB, toB) => Math.min(toA, toB) - Math.max(fromA, fromB) > EPSILON;
  var toCells = (rects) => {
    if (!Array.isArray(rects) || rects[0]?.xPercent === void 0) {
      return rects;
    }
    const boxes = rects.map((rect) => ({
      left: rect.xPercent,
      top: rect.yPercent,
      right: rect.xPercent + rect.widthPercent,
      bottom: rect.yPercent + rect.heightPercent
    }));
    return rects.map((rect, index) => {
      const box = boxes[index];
      const others = boxes.filter((_, other) => other !== index);
      const beside = others.filter(
        (other) => overlaps(box.top, box.bottom, other.top, other.bottom)
      );
      const across = others.filter(
        (other) => overlaps(box.left, box.right, other.left, other.right)
      );
      const before = (edges, at) => {
        const found = edges.filter((edge) => edge <= at + EPSILON);
        return found.length ? (Math.max(...found) + at) / 2 : 0;
      };
      const after = (edges, at) => {
        const found = edges.filter((edge) => edge >= at - EPSILON);
        return found.length ? (Math.min(...found) + at) / 2 : 100;
      };
      const left = before(
        beside.map((other) => other.right),
        box.left
      );
      const right = after(
        beside.map((other) => other.left),
        box.right
      );
      const top = before(
        across.map((other) => other.bottom),
        box.top
      );
      const bottom = after(
        across.map((other) => other.top),
        box.bottom
      );
      return {
        ...rect,
        xPercent: left,
        yPercent: top,
        widthPercent: right - left,
        heightPercent: bottom - top
      };
    });
  };
  var insetTiles = (cells, width, height, gap) => {
    const half = Math.max(0, gap) / 2;
    const inner = (at, limit) => at > 0.5 && at < limit - 0.5;
    return cells.map((cell) => {
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

  // dev/javascript/_lib/serendipity.js
  var SerendipityPreloader = (galleryContainer, debug = false) => {
    const activePreloaders = /* @__PURE__ */ new Set();
    let placeholder = false;
    const startPreloader = () => {
      if (!galleryContainer) {
        return;
      }
      galleryContainer.classList.add(GALLERY_LOADING_CLASS);
      galleryContainer.classList.remove(GALLERY_LOADED_CLASS);
      activePreloaders.add(galleryContainer);
      const computedHeight = galleryContainer.style.height || getComputedStyle(galleryContainer).height;
      if (!computedHeight || computedHeight === "auto") {
        galleryContainer.style.minHeight = "400px";
        placeholder = true;
      }
      if (debug) {
        /* @__PURE__ */ console.log("\u{1F504} Preloader started for gallery");
      }
    };
    const endPreloader = () => {
      if (!galleryContainer) {
        return;
      }
      galleryContainer.classList.remove(GALLERY_LOADING_CLASS);
      galleryContainer.classList.add(GALLERY_LOADED_CLASS);
      activePreloaders.delete(galleryContainer);
      setTimeout(() => {
        if (placeholder && galleryContainer.style.minHeight === "400px") {
          galleryContainer.style.minHeight = "";
        }
        placeholder = false;
      }, 300);
      if (debug) {
        /* @__PURE__ */ console.log("\u2705 Preloader ended for gallery");
      }
    };
    const waitForImages = async (container) => {
      if (!container) {
        return Promise.resolve();
      }
      const images = container.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
          } else {
            const onLoad = () => {
              img.removeEventListener("load", onLoad);
              img.removeEventListener("error", onLoad);
              resolve();
            };
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
          }
        });
      });
      return Promise.all(imagePromises);
    };
    const waitForCriticalImages = async (container, count = 3) => {
      if (!container) {
        return Promise.resolve();
      }
      const images = container.querySelectorAll("img");
      const criticalImages = Array.from(images).slice(0, count);
      const imagePromises = criticalImages.map((img) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalHeight > 0) {
            resolve();
          } else {
            const onLoad = () => {
              img.removeEventListener("load", onLoad);
              img.removeEventListener("error", onLoad);
              resolve();
            };
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
            setTimeout(resolve, 3e3);
          }
        });
      });
      return Promise.all(imagePromises);
    };
    const getLoadingStrategy = (container) => {
      const imageCount = container.querySelectorAll("img").length;
      if (imageCount <= 6) {
        return "wait-all";
      } else if (imageCount <= 12) {
        return "wait-critical";
      }
      return "immediate";
    };
    const handleLoading = async (container) => {
      if (!container) {
        return;
      }
      const strategy = getLoadingStrategy(container);
      switch (strategy) {
        case "wait-all":
          await waitForImages(container);
          break;
        case "wait-critical":
          await waitForCriticalImages(container, 4);
          break;
        case "immediate":
          await new Promise((resolve) => setTimeout(resolve, 100));
          break;
      }
    };
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
  var convertToPercentages = (rectangles, containerWidth, containerHeight) => {
    return rectangles.map((rect) => ({
      // Store both pixel and percentage values
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      // Percentage values for responsive scaling
      xPercent: rect.x / containerWidth * 100,
      yPercent: rect.y / containerHeight * 100,
      widthPercent: rect.width / containerWidth * 100,
      heightPercent: rect.height / containerHeight * 100
    }));
  };
  var convertToPixels = (rectangles, containerWidth, containerHeight, gap = 0) => {
    const cells = toCells(rectangles).map((rect) => ({
      x: rect.xPercent / 100 * containerWidth,
      y: rect.yPercent / 100 * containerHeight,
      width: rect.widthPercent / 100 * containerWidth,
      height: rect.heightPercent / 100 * containerHeight
    }));
    return insetTiles(cells, containerWidth, containerHeight, gap);
  };
  var calculateContainerWidth = (galleryContainer) => {
    if (!galleryContainer) {
      return window.innerWidth;
    }
    const [parentInlinePaddingValue] = splitValueAndUnit(
      window.getComputedStyle(galleryContainer.parentNode).paddingInline
    );
    return galleryContainer.offsetWidth > window.innerWidth ? window.innerWidth - parentInlinePaddingValue * 2 : galleryContainer.offsetWidth;
  };
  var Serendipity = (galleryContainer, options = { gap: "2px", debug: false }) => {
    if (!galleryContainer) {
      return;
    }
    const GAP = splitValueAndUnit(options.gap)[0] ?? 2;
    const MIN_HEIGHT = "720px";
    const DEBUG = options.debug;
    const paintTile = typeof options.paintTile === "function" ? options.paintTile : null;
    let originalDimensions = null;
    let savedPercentageLayout = null;
    const preloader = SerendipityPreloader(galleryContainer);
    preloader.startPreloader();
    if (!galleryContainer) {
      preloader.endPreloader();
      return;
    }
    const items = Array.from(
      galleryContainer.querySelectorAll(GALLERY_ITEM_SELECTOR)
    );
    const totalItems = items.length;
    if (totalItems === 0) {
      preloader.endPreloader();
      return;
    }
    const applyImprovedLayout = (minHeight, defaultRectangles = null, aspectRatio = "auto") => {
      galleryContainer.style.display = "block";
      galleryContainer.style.aspectRatio = aspectRatio;
      if (!galleryContainer.style.minHeight) {
        galleryContainer.style.minHeight = MIN_HEIGHT;
      }
      if (minHeight?.length > 0 && minHeight !== "auto") {
        galleryContainer.style.minHeight = minHeight;
      }
      preloader.releasePlaceholder();
      items.forEach((item) => {
        item.style.gridColumn = "";
        item.style.gridRow = "";
        item.style.position = "absolute";
        item.style.margin = "0";
        item.style.boxSizing = "border-box";
        const link = item.querySelector("a");
        if (link) {
          link.style.display = "block";
          link.style.width = "100%";
          link.style.height = "100%";
        }
        const img = item.querySelector("img");
        if (img) {
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.display = "block";
        }
      });
      const containerWidth = calculateContainerWidth(galleryContainer);
      const containerHeight = galleryContainer.offsetHeight;
      let rectangles = [];
      if (defaultRectangles?.length > 0) {
        const hasPercentages = defaultRectangles[0]?.xPercent !== void 0;
        if (hasPercentages) {
          rectangles = convertToPixels(
            defaultRectangles,
            containerWidth,
            containerHeight,
            GAP
          );
          if (DEBUG) {
            /* @__PURE__ */ console.log(
              "\u{1F4D0} Applied saved layout with responsive scaling"
            );
          }
        } else {
          rectangles = defaultRectangles;
          if (DEBUG) {
            /* @__PURE__ */ console.log(
              "\u26A0\uFE0F Using pixel-based layout (non-responsive)"
            );
          }
        }
        if (hasPercentages) {
          savedPercentageLayout = defaultRectangles;
          originalDimensions = {
            width: containerWidth,
            height: containerHeight
          };
        }
      } else {
        const weights = generateRandomizedWeights(totalItems);
        savedPercentageLayout = convertToPercentages(
          balancedTreemap(weights, containerWidth, containerHeight, 0),
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
          height: containerHeight
        };
        if (DEBUG) {
          /* @__PURE__ */ console.log("\u2728 Generated new responsive layout");
        }
      }
      rectangles.forEach((rect, i) => {
        if (i < items.length) {
          const item = items[i];
          item.style.left = rect.x + "px";
          item.style.top = rect.y + "px";
          item.style.width = rect.width + "px";
          item.style.height = rect.height + "px";
          paintTile?.(item, savedPercentageLayout?.[i]);
        }
      });
      return rectangles;
    };
    const handleResize = () => {
      if (!savedPercentageLayout) {
        return;
      }
      const containerWidth = calculateContainerWidth(galleryContainer);
      const containerHeight = galleryContainer.offsetHeight;
      const scaledRectangles = convertToPixels(
        savedPercentageLayout,
        containerWidth,
        containerHeight,
        GAP
      );
      scaledRectangles.forEach((rect, i) => {
        if (i < items.length) {
          const item = items[i];
          item.style.left = rect.x + "px";
          item.style.top = rect.y + "px";
          item.style.width = rect.width + "px";
          item.style.height = rect.height + "px";
        }
      });
      if (DEBUG) {
        /* @__PURE__ */ console.log(
          "\u{1F504} Layout scaled to new dimensions:",
          {
            from: originalDimensions,
            to: { width: containerWidth, height: containerHeight }
          },
          galleryContainer
        );
      }
    };
    const getLayoutData = () => {
      if (!savedPercentageLayout) {
        if (DEBUG) {
          console.warn("No layout data available yet");
        }
        return null;
      }
      return {
        rectangles: savedPercentageLayout,
        originalDimensions,
        format: "percentage",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalItems
      };
    };
    const loadLayoutData = (layoutData) => {
      if (!layoutData || !layoutData.rectangles) {
        if (DEBUG) {
          console.error("Invalid layout data");
        }
        return false;
      }
      const hasPercentages = layoutData.rectangles[0]?.xPercent !== void 0;
      if (hasPercentages) {
        savedPercentageLayout = layoutData.rectangles;
        originalDimensions = layoutData.originalDimensions;
        if (DEBUG) {
          /* @__PURE__ */ console.log("\u2705 Loaded percentage-based layout data");
        }
        return true;
      }
      if (layoutData.originalDimensions) {
        savedPercentageLayout = convertToPercentages(
          layoutData.rectangles,
          layoutData.originalDimensions.width,
          layoutData.originalDimensions.height
        );
        originalDimensions = layoutData.originalDimensions;
        if (DEBUG) {
          /* @__PURE__ */ console.log("\u2705 Converted legacy pixel data to percentages");
        }
        return true;
      }
      if (DEBUG) {
        console.warn(
          "\u26A0\uFE0F Cannot convert legacy data without original dimensions"
        );
      }
      return false;
    };
    const generateRandomizedWeights = (count) => {
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
    const shuffleArray = (array) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };
    const balancedTreemap = (data, width, height, padding = 0) => {
      const total = data.reduce((sum, value) => sum + value, 0);
      const normalizedData = data.map((value) => value / total);
      const totalArea = width * height;
      const areas = normalizedData.map((value) => value * totalArea);
      return binaryPartition(areas, { x: 0, y: 0, width, height }, padding);
    };
    const binaryPartition = (areas, container, padding) => {
      if (areas.length === 0) {
        return [];
      }
      if (areas.length === 1) {
        return [
          {
            x: container.x + padding,
            y: container.y + padding,
            width: container.width - padding * 2,
            height: container.height - padding * 2
          }
        ];
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
      const firstGroupArea = firstGroup.reduce(
        (sum, area) => sum + area,
        0
      );
      const secondGroupArea = secondGroup.reduce(
        (sum, area) => sum + area,
        0
      );
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
      return [
        ...binaryPartition(firstGroup, firstContainer, padding),
        ...binaryPartition(secondGroup, secondContainer, padding)
      ];
    };
    const init = async (minHeight, defaultRectangles = null, aspectRatio = "auto") => {
      await preloader.handleLoading();
      preloader.startPreloader();
      const rectangles = applyImprovedLayout(
        minHeight,
        defaultRectangles,
        aspectRatio
      );
      const layoutEvent = new CustomEvent("serendipityLayoutCalculated", {
        detail: {
          galleryId: galleryContainer.parentNode.dataset.galleryId,
          rectangles: savedPercentageLayout || rectangles,
          // Send percentage data
          pixelRectangles: rectangles,
          // Also include pixel data for reference
          originalDimensions,
          format: "percentage",
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
    const destroy = () => {
      galleryContainer.style.removeProperty("display");
      galleryContainer.style.removeProperty("aspect-ratio");
      galleryContainer.style.removeProperty("min-height");
      galleryContainer.classList.remove(GALLERY_LOADING_CLASS);
      galleryContainer.classList.remove(GALLERY_LOADED_CLASS);
      items.forEach((item) => {
        item.removeAttribute("style");
        const link = item.querySelector("a");
        if (link) {
          link.removeAttribute("style");
        }
        const img = item.querySelector("img");
        if (img) {
          img.removeAttribute("style");
        }
      });
      if (DEBUG) {
        /* @__PURE__ */ console.log("\u{1F5D1}\uFE0F Serendipity instance destroyed");
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
      convertToPercentages: (rects) => convertToPercentages(
        rects,
        originalDimensions.width,
        originalDimensions.height
      ),
      convertToPixels: (rects) => convertToPixels(
        rects,
        galleryContainer.offsetWidth,
        galleryContainer.offsetHeight,
        GAP
      )
    };
  };

  // dev/javascript/_lib/layoutResolution.js
  var DEVICE_ORDER = ["Mobile", "Tablet", "Desktop"];
  var isScalable = (entry) => entry?.rectangles?.[0]?.xPercent !== void 0;
  var describesGallery = (entry, itemCount) => Array.isArray(entry?.rectangles) && entry.rectangles.length === itemCount && DEVICE_ORDER.includes(entry?.deviceType);
  var resolveLayout = (layoutData, deviceType, itemCount) => {
    const usable = (Array.isArray(layoutData) ? layoutData : []).filter(
      (entry) => describesGallery(entry, itemCount)
    );
    const exact = usable.find((entry) => entry.deviceType === deviceType);
    if (exact) {
      return { layout: exact, borrowed: false };
    }
    const here = DEVICE_ORDER.indexOf(deviceType);
    if (here === -1) {
      return { layout: null, borrowed: false };
    }
    const nearest = usable.filter(isScalable).sort((a, b) => {
      const distance = Math.abs(DEVICE_ORDER.indexOf(a.deviceType) - here) - Math.abs(DEVICE_ORDER.indexOf(b.deviceType) - here);
      return distance || DEVICE_ORDER.indexOf(b.deviceType) - DEVICE_ORDER.indexOf(a.deviceType);
    })[0];
    return nearest ? { layout: nearest, borrowed: true } : { layout: null, borrowed: false };
  };

  // dev/javascript/_lib/enhancement.js
  var pending = /* @__PURE__ */ new Map();
  var loadEnhancement = (seat, doc = document) => {
    const key = seat.script;
    if (pending.has(key)) {
      return pending.get(key);
    }
    const promise = new Promise((resolve, reject) => {
      if (seat.style) {
        const link = doc.createElement("link");
        link.rel = "stylesheet";
        link.href = seat.style;
        doc.head.appendChild(link);
      }
      const script = doc.createElement("script");
      script.src = seat.script;
      script.async = true;
      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () => {
        pending.delete(key);
        reject(new Error(`Enhancement failed to load: ${key}`));
      });
      doc.head.appendChild(script);
    });
    pending.set(key, promise);
    return promise;
  };

  // dev/javascript/ghostlabs-serendipity.js
  window.GhostLabsSerendipity = window.GhostLabsSerendipity || {};
  var getA11yString = (key, fallback) => window.ghostlabsSerendipityA11y?.[key] ?? fallback;
  var ghostLabsSerendipity = () => {
    const galleryItems = document.querySelectorAll(".ghostlabs-serendipity");
    if (!galleryItems.length) {
      return null;
    }
    const getDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 440) {
        return "Mobile";
      }
      if (width <= 780) {
        return "Tablet";
      }
      return "Desktop";
    };
    const intersectionObserver = (items) => {
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const {
                aspectRatio,
                debug,
                deviceType,
                gap,
                minHeight,
                rectangles
              } = collectArgs(entry.target);
              if (deviceType === "Mobile" && entry.target.classList.contains(
                "ghostlabs-serendipity--stack-on-mobile"
              )) {
                observer.unobserve(entry.target);
                return;
              }
              const gallery = Serendipity(entry.target, {
                gap,
                debug
              });
              gallery.init(minHeight, rectangles, aspectRatio);
              const state = {
                currentDeviceType: deviceType,
                gallery
              };
              resizeObserver(entry.target, state);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.01,
          // rootMargin: '-50px',
          rootMargin: "0px"
        }
      );
      items.forEach((gallery) => {
        observer.observe(gallery);
      });
    };
    const handleResize = (galleryItem, state) => {
      const { aspectRatio, deviceType, gap, minHeight, rectangles } = collectArgs(galleryItem);
      if (deviceType === "Mobile" && galleryItem.classList.contains(
        "ghostlabs-serendipity--stack-on-mobile"
      )) {
        if (state.gallery) {
          state.gallery.destroy();
          state.gallery = null;
        }
        return;
      }
      if (!state.gallery || !state.gallery.isInitialized()) {
        state.gallery = Serendipity(galleryItem, { gap });
        state.gallery.init(minHeight, rectangles, aspectRatio);
      }
      let setMinHeight = minHeight;
      if (state.gallery.getLayoutData()) {
        const { originalDimensions } = state.gallery.getLayoutData();
        if (window.innerWidth < originalDimensions.width) {
          setMinHeight = `${window.innerWidth * 0.35}px`;
        }
        galleryItem.style.minHeight = setMinHeight;
      }
      if (state.currentDeviceType !== deviceType) {
        state.gallery.init(setMinHeight, rectangles, aspectRatio);
        state.currentDeviceType = deviceType;
      }
      state.gallery.handleResize();
    };
    const resizeObserver = (galleryItem, state) => {
      let resizeTimer;
      const observer = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          handleResize(galleryItem, state);
        }, 480);
      });
      observer.observe(window.document.body);
    };
    const collectArgs = (target) => {
      const { gap, minHeight, debug } = target.dataset;
      const store = window.GhostLabsSerendipityGallery || {};
      const layoutData = Object.prototype.hasOwnProperty.call(store, target.id) && store[target.id]?.layoutData || [];
      const deviceType = getDeviceType();
      const itemCount = target.querySelectorAll(
        ":scope > .ghostlabs-serendipity__gallery-item"
      ).length;
      const { layout, borrowed } = resolveLayout(
        layoutData,
        deviceType,
        itemCount
      );
      return {
        aspectRatio: layout?.aspectRatio || "auto",
        debug: debug === "1",
        deviceType,
        gap,
        // A borrowed layout brings its geometry but not its height. Percentages
        // scale to whatever box they are given; a Desktop min-height does not,
        // and would leave a phone scrolling through a 720px-tall gallery.
        minHeight: !borrowed && layout?.minHeight ? layout.minHeight : minHeight,
        rectangles: layout?.rectangles || null
      };
    };
    const _handleGalleryEvent = (gallery, e) => {
      const enhanced = window.GhostLabsSerendipity?.galleryClickHandler;
      if (typeof enhanced === "function") {
        enhanced(gallery, e);
        return;
      }
      const seat = window.GhostLabsSerendipity?.enhancement;
      if (seat?.script && seat.lightbox && gallery.dataset.lightbox === seat.lightbox) {
        e.preventDefault();
        loadEnhancement(seat).then(() => {
          const handler = window.GhostLabsSerendipity?.galleryClickHandler;
          if (typeof handler === "function") {
            handler(gallery, e);
          }
        });
        return;
      }
      _forwardToTrigger(e);
    };
    const _forwardToTrigger = (e) => {
      const tile = e.target.closest(".ghostlabs-serendipity__gallery-item");
      if (!tile || e.target.closest("a, .ghostlabs-serendipity__trigger") || e.defaultPrevented) {
        return;
      }
      const trigger = tile.querySelector(
        "a, .ghostlabs-serendipity__trigger"
      );
      if (trigger) {
        e.preventDefault();
        trigger.click();
      }
    };
    const bindGalleryEvents = (galleries) => {
      galleries.forEach((gallery) => {
        gallery.addEventListener(
          "click",
          _handleGalleryEvent.bind(null, gallery)
        );
      });
    };
    const init = () => {
      intersectionObserver(galleryItems);
      bindGalleryEvents(galleryItems);
    };
    return {
      init
    };
  };
  window.GhostLabsSerendipity.getA11yString = getA11yString;
  document.addEventListener("DOMContentLoaded", () => {
    const ghostLabsSerendipityObject = ghostLabsSerendipity();
    if (ghostLabsSerendipityObject?.init) {
      ghostLabsSerendipityObject.init();
    }
  });
})();

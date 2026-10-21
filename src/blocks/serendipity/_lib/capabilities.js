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
export const CAPABILITY = {
	BUILT_IN_LIGHTBOX: 'built-in-lightbox',
	HOVER_STYLES_EXTENDED: 'hover-styles-extended',
	PAN_TILT: 'pan-tilt',
	LAYOUT_STUDIO: 'layout-studio',
	PATTERN_LIBRARY: 'pattern-library',
};

/**
 * @param {string} capability One of CAPABILITY.
 * @return {boolean} Whether this build may use it.
 */
export const hasCapability = ( capability ) =>
	window.ghostlabsSerendipityCapabilities?.[ capability ] === true;

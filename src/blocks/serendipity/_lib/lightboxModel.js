import { __, sprintf } from '@wordpress/i18n';
import { CAPABILITY, hasCapability } from './capabilities';
import { UPSELL, sellsUpgrade, upgradeUrl } from './upgradeUrl';

/**
 * The Lightbox select's options. Mirrors the PHP enum of the same name.
 *
 * Four of these emit a plain anchor and let whatever lightbox the site already runs pick
 * the gallery up; the fifth opens the bundled carousel and is the only one that costs a
 * license.
 */
export const LIGHTBOX = {
	OWN: 'own',
	FILE: 'file',
	ATTACHMENT: 'attachment',
	NONE: 'none',
	BUILT_IN: 'builtin',
};

export const LIGHTBOX_DEFAULT = LIGHTBOX.OWN;

/**
 * The modes, in the select's order, with names resolved when asked.
 *
 * @return {Array<{label: string, value: string}>} The modes.
 */
const modes = () => [
	{
		label: __( 'Your lightbox plugin (default)', 'ghostlabs-serendipity' ),
		value: LIGHTBOX.OWN,
	},
	{
		label: __( 'Link to image file', 'ghostlabs-serendipity' ),
		value: LIGHTBOX.FILE,
	},
	{
		label: __( 'Link to attachment page', 'ghostlabs-serendipity' ),
		value: LIGHTBOX.ATTACHMENT,
	},
	{ label: __( 'No link', 'ghostlabs-serendipity' ), value: LIGHTBOX.NONE },
	{
		label: __( 'Built-in carousel', 'ghostlabs-serendipity' ),
		value: LIGHTBOX.BUILT_IN,
	},
];

/**
 * @param {string} value A lightbox mode.
 * @return {boolean} Whether this build may not use it — only ever the carousel.
 */
export const isLockedLightbox = ( value ) =>
	value === LIGHTBOX.BUILT_IN &&
	! hasCapability( CAPABILITY.BUILT_IN_LIGHTBOX );

/**
 * What the site actually uses for a stored mode: a locked carousel renders as
 * `Lightbox::DEFAULT`, applied by `AttributeGate`. The stored value is kept.
 *
 * @param {string} stored The block's lightbox mode.
 * @return {string} The mode in effect.
 */
export const lightboxRunning = ( stored ) =>
	isLockedLightbox( stored ) ? LIGHTBOX_DEFAULT : stored;

/**
 * @param {string} value A lightbox mode.
 * @return {string} Its name, as the select shows it.
 */
export const lightboxName = ( value ) =>
	modes().find( ( mode ) => mode.value === value )?.label ?? value;

/**
 * Options for the SelectControl. Since 2026-10-03 the carousel is offered like any other mode
 * and **answers the click** (the convention's Upsell select): only once refused, a beat after
 * it was chosen, is it disabled. It stays the last option so the list does not reorder between
 * builds.
 *
 * @param {string|null} refused The mode currently refused, or null.
 * @return {Array<{label: string, value: string, disabled?: boolean}>} Select options.
 */
export const lightboxOptions = ( refused = null ) =>
	modes().map( ( { label, value } ) =>
		value === refused && isLockedLightbox( value )
			? { label, value, disabled: true }
			: { label, value }
	);

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
export const lightboxRefusalCopy = ( { running, isStored } ) => {
	const sells = sellsUpgrade();

	const outcome = isStored
		? sprintf(
				/* translators: %s: the name of a lightbox mode, e.g. "Your lightbox plugin". */
				__(
					'This gallery keeps that setting; your site uses “%s” in its place.',
					'ghostlabs-serendipity'
				),
				__( 'Your lightbox plugin', 'ghostlabs-serendipity' )
		  )
		: sprintf(
				/* translators: %s: the name of a lightbox mode, e.g. "Link to image file". */
				__(
					'The Lightbox setting is still “%s” — nothing changed.',
					'ghostlabs-serendipity'
				),
				lightboxName( running )
		  );

	return sells
		? {
				title: __(
					'The built-in carousel is in Serendipity Deluxe.',
					'ghostlabs-serendipity'
				),
				lines: [
					__(
						'It opens each photograph in a carousel with captions and autoplay, and needs no lightbox plugin.',
						'ghostlabs-serendipity'
					),
					outcome,
				],
				url: upgradeUrl( UPSELL.LIGHTBOX ),
		  }
		: {
				title: __(
					'The built-in carousel needs an active Serendipity Deluxe license.',
					'ghostlabs-serendipity'
				),
				lines: [ outcome ],
				url: null,
		  };
};

/**
 * The help text under the select, which is where the mode earns its keep.
 *
 * @param {string} value The selected lightbox mode.
 * @return {string} Help text.
 */
export const lightboxHelp = ( value ) => {
	switch ( value ) {
		case LIGHTBOX.BUILT_IN:
			return __(
				'Opens the bundled carousel. Loads its own script and styles on pages that use it.',
				'ghostlabs-serendipity'
			);
		case LIGHTBOX.ATTACHMENT:
			return __(
				'Each image links to its attachment page.',
				'ghostlabs-serendipity'
			);
		case LIGHTBOX.NONE:
			return __(
				'Images are not linked. Nothing happens on click.',
				'ghostlabs-serendipity'
			);
		case LIGHTBOX.FILE:
			return __(
				'Each image links to the full-size file, ungrouped — for lightboxes that do their own grouping.',
				'ghostlabs-serendipity'
			);
		default:
			return __(
				'Links each image to the full-size file and groups the gallery, so a lightbox plugin you already run can pick it up.',
				'ghostlabs-serendipity'
			);
	}
};

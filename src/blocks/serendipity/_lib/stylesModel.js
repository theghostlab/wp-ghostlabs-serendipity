import { __, sprintf } from '@wordpress/i18n';

import LinkIcon from '../_components/LinkIcon';
import { CAPABILITY, hasCapability } from './capabilities';
import { UPSELL, sellsUpgrade, upgradeUrl } from './upgradeUrl';

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
const styles = () => [
	{ label: __( 'None', 'ghostlabs-serendipity' ), value: '' },
	{ label: __( 'Fade-Up', 'ghostlabs-serendipity' ), value: FREE_STYLE },
	{
		label: __( 'Split Reveal', 'ghostlabs-serendipity' ),
		value: 'style-2',
		licensed: true,
	},
	{
		label: __( 'Zoom and Blur Focus', 'ghostlabs-serendipity' ),
		value: 'style-3',
		licensed: true,
	},
	{
		label: __( 'Card Flip', 'ghostlabs-serendipity' ),
		value: 'style-5',
		licensed: true,
	},
];

/**
 * @param {string} value A hover style value.
 * @return {boolean} Whether this build may not use it.
 */
export const isLockedHoverStyle = ( value ) =>
	! hasCapability( CAPABILITY.HOVER_STYLES_EXTENDED ) &&
	styles().some( ( style ) => style.licensed && style.value === value );

/**
 * @param {string} value A hover style value.
 * @return {string} Its name, in the current locale.
 */
export const hoverStyleName = ( value ) =>
	styles().find( ( style ) => style.value === value )?.label ?? value;

/**
 * What the site actually shows for a stored style.
 *
 * @param {string} stored The block's hover style.
 * @return {string} The stored style, or Fade-Up where it is locked.
 */
export const hoverRunning = ( stored ) =>
	isLockedHoverStyle( stored ) ? FREE_STYLE : stored;

/**
 * Options for the SelectControl. Every style is offered; only the one just refused is
 * disabled, a beat after it was chosen (`useRefusal`).
 *
 * @param {string|null} refused The style currently refused, or null.
 * @return {Array<{label: string, value: string, disabled?: boolean}>} Select options.
 */
export const hoverStyleOptions = ( refused = null ) =>
	styles().map( ( { label, value } ) =>
		value === refused && isLockedHoverStyle( value )
			? { label, value, disabled: true }
			: { label, value }
	);

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
export const hoverRefusalCopy = ( { picked, running, isStored } ) => {
	const sells = sellsUpgrade();

	const title = sells
		? sprintf(
				/* translators: %s: the name of a hover style, e.g. "Card Flip". */
				__(
					'%s is a Serendipity Deluxe hover style.',
					'ghostlabs-serendipity'
				),
				hoverStyleName( picked )
		  )
		: sprintf(
				/* translators: %s: the name of a hover style, e.g. "Card Flip". */
				__(
					'%s needs an active Serendipity Deluxe license.',
					'ghostlabs-serendipity'
				),
				hoverStyleName( picked )
		  );

	let outcome;

	if ( isStored ) {
		outcome = sprintf(
			/* translators: %s: the name of the free hover style, "Fade-Up". */
			__(
				'This gallery keeps that setting; your site shows %s in its place.',
				'ghostlabs-serendipity'
			),
			hoverStyleName( FREE_STYLE )
		);
	} else if ( running === '' ) {
		outcome = __(
			'Your gallery still has no hover style — nothing changed.',
			'ghostlabs-serendipity'
		);
	} else {
		outcome = sprintf(
			/* translators: %s: the name of a hover style, e.g. "Fade-Up". */
			__(
				'Your gallery still uses %s — nothing changed.',
				'ghostlabs-serendipity'
			),
			hoverStyleName( running )
		);
	}

	const lines = sells
		? [
				sprintf(
					/* translators: %s: the name of the free hover style, "Fade-Up". */
					__( 'Free includes %s.', 'ghostlabs-serendipity' ),
					hoverStyleName( FREE_STYLE )
				),
				outcome,
		  ]
		: [ outcome ];

	return { title, lines, url: upgradeUrl( UPSELL.HOVER_STYLE ) };
};

export const StylesElements = ( { style, caption } ) => {
	if ( style === 'style-2' ) {
		if ( ! caption?.length ) {
			return (
				<div className="caption">
					<LinkIcon />
				</div>
			);
		}
		return <div className="caption">{ caption }</div>;
	}

	if ( style === 'style-3' ) {
		if ( ! caption?.length ) {
			return (
				<div className="caption-container">
					<div className="caption">
						<LinkIcon />
					</div>
				</div>
			);
		}

		return (
			<div className="caption-container">
				<div className="caption">{ caption }</div>
			</div>
		);
	}

	if ( style === 'style-5' ) {
		if ( ! caption?.length ) {
			return (
				<div className="back">
					<div className="caption">
						<LinkIcon />
					</div>
				</div>
			);
		}

		return (
			<div className="back">
				<div className="caption">{ caption }</div>
			</div>
		);
	}

	return '';
};

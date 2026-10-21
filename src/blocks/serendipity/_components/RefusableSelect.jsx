import {
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components';

import { useRef } from '@wordpress/element';

import { useRefusal } from '../_lib/useRefusal';
import UpsellNotice from './UpsellNotice';

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
const RefusableSelect = ( {
	label,
	stored,
	options,
	isLocked,
	copy,
	onChange,
	help,
} ) => {
	const refusal = useRefusal( { stored, isLocked, onChange } );
	const wrapper = useRef( null );

	// ⚠️ Dismissing unmounts the notice's button with focus on it, and focus fell to <body>:
	// the next Tab started from the top of the document (accessibility audit, 2026-10-16). It
	// goes back to the field the notice was about.
	const dismiss = () => {
		refusal.dismiss();
		wrapper.current?.querySelector( 'select' )?.focus();
	};

	// ⚠️ One wrapper, carrying the panel's rhythm itself. Core spaces controls with a margin
	// on a `.components-base-control` that is a DIRECT child of the panel; wrapping the select
	// took that away and left the next control flush against it (measured 0px, 2026-10-11).
	// `.ghostlabs-serendipity-refusable` in editor.scss gives the 16px back.
	return (
		<div className="ghostlabs-serendipity-refusable" ref={ wrapper }>
			<div { ...refusal.pointerHandlers }>
				<SelectControl
					label={ label }
					className={
						refusal.showingRefused
							? 'ghostlabs-serendipity-select--refused'
							: undefined
					}
					value={ refusal.value }
					options={ options( refusal.refused ) }
					help={ help ? help( stored ) : undefined }
					onChange={ refusal.onChange }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>
			{ refusal.notice && (
				<Spacer marginTop={ 4 } marginBottom={ 0 }>
					<UpsellNotice
						{ ...copy( refusal.notice ) }
						onRemove={ dismiss }
					/>
				</Spacer>
			) }
		</div>
	);
};

export default RefusableSelect;

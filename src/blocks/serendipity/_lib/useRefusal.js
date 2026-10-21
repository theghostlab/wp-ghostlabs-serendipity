import { useEffect, useRef, useState } from '@wordpress/element';

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
export const REFUSAL_DELAY = 200;

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
export const useRefusal = ( { stored, isLocked, onChange } ) => {
	/**
	 * The locked value the author chose, which the field goes on showing.
	 *
	 * ⚠️ The *display*, never the block. While it is set the control shows a value the block
	 * does not have, and the only thing saying so is the notice — so the notice is not optional.
	 */
	const [ pending, setPending ] = useState( null );

	/**
	 * The one locked value currently refused, or null. **One, never a list**: an author who
	 * tried three styles to see what they were would otherwise be left with a control full of
	 * dead entries and no way to ask about any of them again.
	 */
	const [ refused, setRefused ] = useState( null );

	/**
	 * The one notice, or null: `{ picked, isStored }`. Seeded from the attribute, so a block
	 * that already holds a locked value — a downgraded site — is told on arrival rather than
	 * only if it happens to reopen the select.
	 */
	const [ notice, setNotice ] = useState( () =>
		isLocked( stored ) ? { picked: stored, isStored: true } : null
	);

	const timer = useRef( null );

	// The timeout outlives the component if the block is deselected inside the beat.
	useEffect( () => () => clearTimeout( timer.current ), [] );

	/**
	 * Whether the author reached the control with a pointer. ⚠️ Not `:focus-visible`: Chrome
	 * reports it true for a `<select>` after a plain mouse click. Observed directly instead.
	 */
	const pointerDriven = useRef( false );

	/**
	 * Let the field go once the offer is withdrawn, so it stops holding a focus ring around a
	 * value it no longer claims.
	 *
	 * 🔴 **Pointer authors only.** For a keyboard author the ring is their cursor: blurring
	 * sends focus to `<body>` and the next Tab restarts at the top of the document (WCAG 2.4.3).
	 *
	 * @param {HTMLSelectElement|null} field The select the author used.
	 */
	const releaseFocus = ( field ) => {
		if ( ! pointerDriven.current ) {
			return;
		}

		if ( ! field || field.ownerDocument.activeElement !== field ) {
			return;
		}

		field.blur();
	};

	const refuse = ( value, field ) => {
		setPending( value );
		// A block already holding a locked value is not running the one it holds either, so
		// a locked-to-locked swap takes the downgraded wording.
		setNotice( { picked: value, isStored: isLocked( stored ) } );
		setRefused( null );

		clearTimeout( timer.current );

		timer.current = setTimeout( () => {
			setRefused( value );
			releaseFocus( field );
		}, REFUSAL_DELAY );
	};

	const handleChange = ( value, extra ) => {
		// `SelectControl` hands the change event through its second argument. Only ever used
		// to hand focus back (`releaseFocus`); without it, focus is simply left alone.
		const field = extra?.event?.target ?? null;

		// ⚠️ The value must not reach the block. See the docblock above.
		if ( isLocked( value ) ) {
			refuse( value, field?.tagName === 'SELECT' ? field : null );

			return;
		}

		clearTimeout( timer.current );
		setPending( null );
		setNotice( null );
		setRefused( null );

		onChange( value );
	};

	return {
		value: pending ?? stored,
		refused,
		notice,
		dismiss: () => setNotice( null ),
		onChange: handleChange,
		// True only once the beat is up, so the click lands at full strength first.
		showingRefused: refused !== null && pending === refused,
		pointerHandlers: {
			onPointerDownCapture: () => {
				pointerDriven.current = true;
			},
			onKeyDownCapture: () => {
				pointerDriven.current = false;
			},
		},
	};
};

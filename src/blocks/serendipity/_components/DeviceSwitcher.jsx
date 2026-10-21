import { __, sprintf } from '@wordpress/i18n';
import { ToolbarButton, ToolbarGroup, Tooltip } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { desktop, mobile, tablet } from '@wordpress/icons';

import { isLayoutCurrent } from '../_lib/_blockUtils';

const DEVICES = [
	{
		type: 'Desktop',
		icon: desktop,
		label: __( 'Desktop', 'ghostlabs-serendipity' ),
	},
	{
		type: 'Tablet',
		icon: tablet,
		label: __( 'Tablet', 'ghostlabs-serendipity' ),
	},
	{
		type: 'Mobile',
		icon: mobile,
		label: __( 'Mobile', 'ghostlabs-serendipity' ),
	},
];

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
const DeviceSwitcher = ( { deviceType, layoutData, imageCount } ) => {
	const editor = useDispatch( 'core/editor' );

	const setDevice = ( type ) => {
		// `setDeviceType` since WP 6.5; the experimental name is what older editors
		// answer to, and dropping the call entirely would leave a dead button.
		const setter =
			editor?.setDeviceType ?? editor?.__experimentalSetPreviewDeviceType;

		setter?.( type );
	};

	// Saved only while it still fits: a layout whose tile count no longer matches the
	// images is discarded on load, so it is not "saved" in any sense the author cares about.
	const isSaved = ( type ) =>
		isLayoutCurrent( { layoutData, deviceType: type, imageCount } );

	return (
		<ToolbarGroup>
			{ DEVICES.map( ( { type, icon, label } ) => {
				const saved = isSaved( type );

				// ⚠️ The name is the breakpoint and never changes; whether a layout is saved is the
				// description. A name that carried the state ("Desktop — layout saved") changed
				// when a layout was saved (accessibility audit, 2026-10-16, #26). For an
				// icon-only button the tooltip IS the name, so the tooltip is set apart to keep
				// saying both, and a sighted pointer user loses nothing (owner's pick 4 B,
				// 2026-10-17). The name is contained in the tooltip, as 2.5.3 asks.
				const tooltip = saved
					? sprintf(
							/* translators: %s: a breakpoint — Desktop, Tablet or Mobile. */
							__( '%s — layout saved', 'ghostlabs-serendipity' ),
							label
					  )
					: sprintf(
							/* translators: %s: a breakpoint — Desktop, Tablet or Mobile. */
							__(
								'%s — no layout saved yet',
								'ghostlabs-serendipity'
							),
							label
					  );

				return (
					<Tooltip key={ type } text={ tooltip }>
						<ToolbarButton
							icon={ icon }
							isActive={ deviceType === type }
							className={ `ghostlabs-serendipity-toolbar__device${
								saved
									? ' ghostlabs-serendipity-toolbar__device--saved'
									: ''
							}` }
							label={ label }
							showTooltip={ false }
							description={
								saved
									? __(
											'Layout saved',
											'ghostlabs-serendipity'
									  )
									: __(
											'No layout saved yet',
											'ghostlabs-serendipity'
									  )
							}
							onClick={ () => setDevice( type ) }
						/>
					</Tooltip>
				);
			} ) }
		</ToolbarGroup>
	);
};

export default DeviceSwitcher;

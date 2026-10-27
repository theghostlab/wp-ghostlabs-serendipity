import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { UPSELL, sellsUpgrade, upgradeUrl } from '../_lib/upgradeUrl';
import UpsellNotice from './UpsellNotice';

const STUDIO_READY = 'ghostlabs-serendipity/studio-ready';

/**
 * A seat for Layout Studio, which every edition renders and only one fills.
 *
 * The block is built once, from `shared/`, and ships to both editions — so the studio
 * cannot be imported here without putting it into the free build. It arrives instead as its
 * own script, which the edition that has it enqueues and which assigns itself to a global.
 * This looks for it and renders whatever it finds; what goes there, and when, is that
 * edition's to decide.
 *
 * Where nothing fills it, an edition that sells an upgrade (`sellsUpgrade()`) gets the Upsell
 * panel: a pointer to a feature whose code is not here. Every other renders nothing.
 *
 * @param {Object} props Passed straight through to the studio.
 * @return {Element|null} The studio, where there is one.
 */
const LayoutStudioSeat = ( props ) => {
	const [ Studio, setStudio ] = useState(
		() => window.GhostLabsSerendipity?.LayoutStudio ?? null
	);

	useEffect( () => {
		if ( Studio ) {
			return;
		}

		// The enhancement may load after this has already rendered empty, so it
		// announces itself rather than waiting to be noticed.
		const onReady = () =>
			setStudio(
				() => window.GhostLabsSerendipity?.LayoutStudio ?? null
			);

		window.addEventListener( STUDIO_READY, onReady );

		return () => window.removeEventListener( STUDIO_READY, onReady );
	}, [ Studio ] );

	if ( Studio ) {
		return <Studio { ...props } />;
	}

	if ( ! sellsUpgrade() ) {
		return null;
	}

	// Shown, not hidden: someone who never sees that seams and reframing exist has
	// no reason to want them. One panel, closed by default because the inspector holds
	// the controls the author came for (the convention's Upsell panel), and nothing
	// else — no modal, no badge on the toolbar.
	//
	// ⚠️ The notice is not dismissible and says nothing aloud (`announce={ false }`):
	// it is the panel's standing content, read when the author opens the panel, not a
	// response to anything they did.
	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Layout Studio', 'ghostlabs-serendipity' ) }
				initialOpen={ false }
			>
				<p>
					{ __(
						'Drag the seams between tiles to resize them, drag a photograph within its tile to reframe it, and drag one tile onto another to swap the two.',
						'ghostlabs-serendipity'
					) }
				</p>
				<UpsellNotice
					title={ __(
						'Layout Studio is in Serendipity Deluxe.',
						'ghostlabs-serendipity'
					) }
					lines={ [
						__(
							'Your galleries and saved layouts carry over unchanged.',
							'ghostlabs-serendipity'
						),
					] }
					url={ upgradeUrl( UPSELL.LAYOUT_STUDIO ) }
					announce={ false }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default LayoutStudioSeat;

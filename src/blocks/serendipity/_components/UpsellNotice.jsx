import { __ } from '@wordpress/i18n';
import { ExternalLink, Notice } from '@wordpress/components';

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
const UpsellNotice = ( { title, lines, url, onRemove, announce = true } ) => (
	<Notice
		className="ghostlabs-serendipity-upsell-notice"
		status="info"
		politeness="polite"
		isDismissible={ typeof onRemove === 'function' }
		onRemove={ onRemove }
		// The rendered children are separate nodes and a link; spoken as one sentence they
		// read as one answer. An empty string is how core is told to say nothing at all.
		spokenMessage={ announce ? [ title, ...lines ].join( ' ' ) : '' }
	>
		<p>
			<strong>{ title }</strong>
		</p>
		{ lines.length > 0 && <p>{ lines.join( ' ' ) }</p> }
		{ url && (
			<p>
				<ExternalLink href={ url }>
					{ __( 'See Serendipity Deluxe', 'ghostlabs-serendipity' ) }
				</ExternalLink>
			</p>
		) }
	</Notice>
);

export default UpsellNotice;

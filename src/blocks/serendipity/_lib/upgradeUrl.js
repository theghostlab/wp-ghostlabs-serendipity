/**
 * Where an upgrade link in the editor points — as PHP built it, or nowhere.
 *
 * 🔴 **No literal in JavaScript, and no fallback.** A hard-coded URL renders, resolves and
 * silently drops the attribution. The edition that sells something inlines a map of finished
 * URLs, one per surface, each carrying its own `from=` (`BlockFactory::editorData()`, filled by
 * the free edition's boot). This reads it. Where the map is absent — any edition with nothing
 * to sell — every surface gets `null`, and the caller renders no link.
 *
 * The block is built once and ships to both editions, which is why the URLs cannot live here.
 */
export const UPSELL = {
	LAYOUT_STUDIO: 'editor-layout-studio',
};

/**
 * @param {string} surface One of UPSELL.
 * @return {string|null} The finished URL, or null where PHP supplied none.
 */
export const upgradeUrl = ( surface ) => {
	const url = window.ghostlabsSerendipityUpgrade?.urls?.[ surface ];

	return typeof url === 'string' && url !== '' ? url : null;
};

/**
 * Whether this edition sells anything at all.
 *
 * @return {boolean} True where PHP inlined an upgrade map.
 */
export const sellsUpgrade = () =>
	typeof window.ghostlabsSerendipityUpgrade?.urls === 'object' &&
	window.ghostlabsSerendipityUpgrade.urls !== null;

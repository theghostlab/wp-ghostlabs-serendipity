/**
 * The gutter is painted, never stored.
 *
 * A saved layout is a partition of the gallery: tiles edge to edge, in percentages. The
 * gap is applied when the tiles are placed, half off each side of every inner edge, so
 * it is the gallery's Gap Size at any width and moves when that setting does.
 *
 * ⚠️ Every layout saved before 2026-10-13 carries its gutters inside its percentages —
 * at whatever width it was saved, and the composer's own margins with them. `toCells()`
 * closes them on read, so those layouts need no migration. `Service\Gutters` is the PHP
 * half and the first frame; the two must agree to the pixel, or a gallery shifts once
 * the script runs. Change one, change both, and both tests share one table.
 */

/** How close two edges (in percent) must be to count as touching. */
const EPSILON = 0.01;

const overlaps = ( fromA, toA, fromB, toB ) =>
	Math.min( toA, toB ) - Math.max( fromA, fromB ) > EPSILON;

/**
 * Close every gutter at its midpoint, and send an edge with nothing beyond it to the
 * border — in a partition, only the border has nothing beyond it.
 *
 * @param {Array<Object>} rects Rectangles with `xPercent` … `heightPercent`.
 * @return {Array<Object>} The same rectangles as cells, every other key kept. Anything
 *                         not in percentages (a legacy pixel layout) comes back as given.
 */
export const toCells = ( rects ) => {
	if ( ! Array.isArray( rects ) || rects[ 0 ]?.xPercent === undefined ) {
		return rects;
	}

	const boxes = rects.map( ( rect ) => ( {
		left: rect.xPercent,
		top: rect.yPercent,
		right: rect.xPercent + rect.widthPercent,
		bottom: rect.yPercent + rect.heightPercent,
	} ) );

	return rects.map( ( rect, index ) => {
		const box = boxes[ index ];
		const others = boxes.filter( ( _, other ) => other !== index );
		const beside = others.filter( ( other ) =>
			overlaps( box.top, box.bottom, other.top, other.bottom )
		);
		const across = others.filter( ( other ) =>
			overlaps( box.left, box.right, other.left, other.right )
		);

		const before = ( edges, at ) => {
			const found = edges.filter( ( edge ) => edge <= at + EPSILON );

			return found.length ? ( Math.max( ...found ) + at ) / 2 : 0;
		};

		const after = ( edges, at ) => {
			const found = edges.filter( ( edge ) => edge >= at - EPSILON );

			return found.length ? ( Math.min( ...found ) + at ) / 2 : 100;
		};

		const left = before(
			beside.map( ( other ) => other.right ),
			box.left
		);
		const right = after(
			beside.map( ( other ) => other.left ),
			box.right
		);
		const top = before(
			across.map( ( other ) => other.bottom ),
			box.top
		);
		const bottom = after(
			across.map( ( other ) => other.top ),
			box.bottom
		);

		return {
			...rect,
			xPercent: left,
			yPercent: top,
			widthPercent: right - left,
			heightPercent: bottom - top,
		};
	} );
};

/**
 * Place cells as tiles: half the gap off each inner edge, nothing off the border.
 *
 * @param {Array<Object>} cells  Pixel cells `{ x, y, width, height }` partitioning the box.
 * @param {number}        width  The box's width, in pixels.
 * @param {number}        height The box's height, in pixels.
 * @param {number}        gap    The gutter, in pixels.
 * @return {Array<Object>} The tiles, every other key kept.
 */
export const insetTiles = ( cells, width, height, gap ) => {
	const half = Math.max( 0, gap ) / 2;
	const inner = ( at, limit ) => at > 0.5 && at < limit - 0.5;

	return cells.map( ( cell ) => {
		const left = inner( cell.x, width ) ? half : 0;
		const top = inner( cell.y, height ) ? half : 0;
		const right = inner( cell.x + cell.width, width ) ? half : 0;
		const bottom = inner( cell.y + cell.height, height ) ? half : 0;

		return {
			...cell,
			x: cell.x + left,
			y: cell.y + top,
			width: Math.max( 0, cell.width - left - right ),
			height: Math.max( 0, cell.height - top - bottom ),
		};
	} );
};

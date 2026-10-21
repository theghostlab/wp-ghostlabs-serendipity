/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * Drawn on the 24px WordPress icon grid so it sits on the same rhythm as the
	 * core icons beside it in the block toolbar: outer frame 4–20, 1.5 border,
	 * 1.5 gutters. The three fields are knocked out of the frame with evenodd,
	 * so what stays inked is the border and the seams between them — the block
	 * is a bounded area partition, and the mark is one.
	 */
	icon: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5 4H19A1 1 0 0 1 20 5V19A1 1 0 0 1 19 20H5A1 1 0 0 1 4 19V5A1 1 0 0 1 5 4ZM5.5 5.5V18.5H9V5.5ZM10.5 5.5V11.25H18.5V5.5ZM10.5 12.75V18.5H18.5V12.75Z"
				fill="currentColor"
			/>
		</svg>
	),
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
} );

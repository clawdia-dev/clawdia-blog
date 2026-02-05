import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/**
 * NOTE: Syntax highlighting disabled
 *
 * Why: mdsvex default highlighter injects {@html} artifacts into code blocks
 * which renders as "{@html `<code>...</code>}`" instead of proper HTML.
 *
 * Future: Consider adding a custom highlighter with Prism.js or highlight.js for client-side highlighting.
 */
/** @type {import('@sveltejs/kit').Config} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: false
};

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		output: {
			bundleStrategy: 'inline'
		}
	},

	preprocess: [mdsvex(mdsvexOptions)],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;

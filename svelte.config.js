import preprocess from 'svelte-preprocess';
import houdini from 'houdini-preprocess';
import node from '@sveltejs/adapter-node';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [preprocess(), houdini()],
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: node(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: 'body',
		vite: {
			server: {
				fs: {
					allow: ['.']
				}
			},
			resolve: {
				alias: {
					$houdini: path.resolve('.', '$houdini')
				}
			}
		}
	}
};

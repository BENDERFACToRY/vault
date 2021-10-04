import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: preprocess(),
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: node(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: 'body',

		vite: {
			optimizeDeps: {
				include: [
					'@apollo/client/core',
					'@apollo/client/cache',
					'@apollo/client/link/ws',
					'@apollo/client/link/context',
					'@apollo/client/link/error',
					'@apollo/client/utilities'
				],
				exclude: ['@apollo/client', 'svelte-apollo', 'subscriptions-transport-ws']
			}
		}
	}
};

import { authorizeUrl } from '$lib/discord';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	return {
		status: 302,
		headers: {
			location: authorizeUrl()
		}
	};
}

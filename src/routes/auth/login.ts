import crypto from 'crypto';

import { authorizeUrl } from '$lib/discord';
import { setCookie, datetimeAfter } from '$lib/cookies';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	// Generate a random state to verify proper oauth process.
	const state = crypto.randomUUID();
	return {
		status: 302,
		headers: {
			location: authorizeUrl(state),
			'Set-Cookie': setCookie('state', state, { expires: datetimeAfter(300) })
		}
	};
}

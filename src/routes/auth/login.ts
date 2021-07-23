import crypto from 'crypto';

import { API } from '$lib/discord';
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
			location: API.authorizeUrl(state),
			'Set-Cookie': setCookie('state', state, { expires: datetimeAfter(300) })
		}
	};
}

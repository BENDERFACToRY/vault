import crypto from 'crypto';

import { API } from '$lib/discord';
import { setCookie, datetimeAfter } from '$lib/cookies';
import type { EndpointOutput } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(): Promise<EndpointOutput> {
	// Generate a random state to verify proper oauth process.
	const state = crypto.randomUUID();
	return {
		status: 302,
		headers: {
			location: API.authorizeUrl(state).toString(),
			'Set-Cookie': setCookie('state', state, { expires: datetimeAfter(300) })
		}
	};
}

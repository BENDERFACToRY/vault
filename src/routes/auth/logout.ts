import gql from 'graphql-tag';
import { query } from '$lib/graphql';
import { setCookie, getCookies } from '$lib/cookies';
import { verifyToken, serverToken } from '$lib/jwt';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export const get = async function get({ headers }) {
	const { token: cookieToken } = getCookies(headers.cookie);

	try {
		// Verify token
		if (cookieToken) {
			const user = await verifyToken(cookieToken);

			// Remove oauth token
			query({
				query: `
					mutation removeTokens($id: uuid!) {
						delete_oauth_token(where: { user_id: { _eq: $id } }) {
							affected_rows
						}
					}
				`,
				variables: { id: user.id },
				token: serverToken('auth-logout')
			});
		}
	} catch (e) {
		console.log('Error logging out:', e);
	}

	// Remove cookie
	return {
		status: 302,
		headers: {
			'Set-Cookie': setCookie('token', '', { expires: new Date('1970') }),
			location: '/'
		}
	};
};

import { token, client, gql } from '$lib/graphql';
import { setCookie, getCookies } from '$lib/cookies';
import { verifyToken, serverToken } from '$lib/jwt';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ headers }) {
	const { token: cookieToken } = getCookies(headers.cookie);

	try {
		// Verify token
		if (cookieToken) {
			const user = await verifyToken(cookieToken);

			token.set(serverToken('auth-logout'));

			// Remove oauth token
			client.request(
				gql`
					mutation removeTokens($id: uuid!) {
						delete_oauth_token(where: { user_id: { _eq: $id } }) {
							affected_rows
						}
					}
				`,
				{ id: user.id }
			);
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
}
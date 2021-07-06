import { verifyToken } from '$lib/jwt';
import { getCookies } from '$lib/cookies';

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(request) {
	const { token } = getCookies(request.headers.cookie);
	if (token) {
		try {
			const user = await verifyToken(token);
			return {
				user: {
					...user,
					token
				}
			};
		} catch (e) {
			console.log('err validating token', e);
			return {};
		}
	}
	return {};
}

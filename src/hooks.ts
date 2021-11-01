import { query } from '$lib/graphql';
import { verifyToken, createToken } from '$lib/jwt';
import { getCookies, setCookie, datetimeAfter } from '$lib/cookies';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
	const { token } = getCookies(request.headers.cookie);
	let JWT;

	if (token) {
		const user = await verifyToken(token, { ignoreExpiration: true });
		if (new Date() > new Date(user.exp * 1000)) {
			// TODO: Make it fool proof
			const JWTUser = {
				id: user.id,
				name: user.name,
				roles: ['user'],
				default_role: 'user'
			};
			JWT = createToken(JWTUser, {
				expiresIn: '1 day',
				subject: user.id.toString()
			});

			console.log('req', request.headers);
			request.headers.cookie = `${new URLSearchParams('token', JWT)}`;
		}
	}

	const response = await resolve(request);
	if (JWT) {
		console.log('Refreshing token', request.path);
		return {
			...response,
			headers: {
				...response.headers,
				'Set-Cookie': [
					...(response.headers['Set-Cookie'] || []),
					setCookie('token', JWT, { expires: datetimeAfter(60 * 60 * 25) })
				]
			}
		};
	}
	return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(request) {
	const { token: headerToken } = getCookies(request.headers.cookie);

	if (headerToken) {
		try {
			const user = await verifyToken(headerToken);

			return {
				user,
				token: headerToken
			};
		} catch (e) {
			console.log('err validating token', e);
			return {};
		}
	}
	return {};
}

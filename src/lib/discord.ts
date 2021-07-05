import { FormData } from 'formdata-node';
import dotenv from 'dotenv';

const DISCORD_API = 'https://discord.com/api/v9';
const STATE = '1234';

dotenv.config();

export async function me(token) {
	return await fetch(`${DISCORD_API}/users/@me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

export function authorizeUrl() {
	const url = new URL(`${DISCORD_API}/oauth2/authorize`);
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('client_id', process.env['VITE_DISCORD_OAUTH_CLIENTID']);
	url.searchParams.append('scope', 'identify');
	url.searchParams.append('state', STATE);
	url.searchParams.append('redirect_uri', process.env['OAUTH_REDIRECT_URL']);
	url.searchParams.append('prompt', 'consent');
	return url;
}

export async function getUserData(state, code) {
	if (state !== STATE) return;

	const formData = new FormData();

	formData.append('client_id', process.env['VITE_DISCORD_OAUTH_CLIENTID']);
	formData.append('client_secret', process.env['DISCORD_OAUTH_CLIENTSECRET']);
	formData.append('grant_type', 'authorization_code');
	formData.append('code', code);
	formData.append('redirect_uri', process.env['OAUTH_REDIRECT_URL']);

	const res = await fetch(`${DISCORD_API}/oauth2/token`, {
		method: 'POST',
		body: formData
	});
	console.log(res.status);

	if (res.ok) {
		const { access_token, expires_in, refresh_token, scope } = await res.json();

		const userResponse = await me(access_token);
		const user = await userResponse.json();

		return {
			access_token,
			expires_in,
			refresh_token,
			scope,
			user
		};
	} else {
		console.log(await res.text());
	}
	return {};
}

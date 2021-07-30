import { FormData } from 'formdata-node';
import dotenv from 'dotenv';

export const BENDERFACTORY_GUILD_ID = '690169153750958091';

dotenv.config();

export class API {
	static DISCORD_API = 'https://discord.com/api/v9';

	token: string;

	constructor(token) {
		this.token = token;
	}

	static authorizeUrl(state: string): URL {
		const url = new URL(`${this.DISCORD_API}/oauth2/authorize`);
		url.searchParams.append('response_type', 'code');
		url.searchParams.append('client_id', process.env['VITE_DISCORD_OAUTH_CLIENTID']);
		url.searchParams.append('scope', 'identify guilds');
		url.searchParams.append('state', state);
		url.searchParams.append('redirect_uri', process.env['OAUTH_REDIRECT_URL']);
		url.searchParams.append('prompt', 'consent');
		return url;
	}
	static async getUserData(code) {
		const formData = new FormData();

		formData.append('client_id', process.env['VITE_DISCORD_OAUTH_CLIENTID']);
		formData.append('client_secret', process.env['DISCORD_OAUTH_CLIENTSECRET']);
		formData.append('grant_type', 'authorization_code');
		formData.append('code', code);
		formData.append('redirect_uri', process.env['OAUTH_REDIRECT_URL']);

		const res = await fetch(`${API.DISCORD_API}/oauth2/token`, {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const { access_token, expires_in, refresh_token, scope } = await res.json();
			const api = new API(access_token);
			const user = await api.me();

			// Check the roles on the discord guild
			try {
				await fetch(`${process.env['GATEKEEPER_URL']}/check/${user.id}`);
			} catch (e) {
				console.log('Error checking user on gatekeeper:', e);
			}

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

	async fetch(url: string, { headers = {}, ...options } = {}): Promise<Response> {
		return fetch(`${API.DISCORD_API}${url}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				...headers
			},
			...options
		});
	}

	async me(): Promise<JSON> {
		const response = await this.fetch('/users/@me');
		return await response.json();
	}

	async currentGuild(): Promise<JSON> {
		const response = await this.fetch('/users/@me/guilds');
		return await response.json();
	}

	async getGuildMember(guildId: string, userId: string): Promise<Response> {
		const res = await this.fetch(`/guilds/${guildId}/members/{${userId}}`);
		const data = await res.json();
		console.log('Got guildmember', data);

		return data;
	}
}

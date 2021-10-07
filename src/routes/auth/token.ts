import gql from 'graphql-tag';
import { API } from '$lib/discord';
import { setCookie, getCookies, datetimeAfter } from '$lib/cookies';
import { serverToken, createToken, verifyToken } from '$lib/jwt';

import { query as gqlQuery } from '$lib/graphql';

/* Token endpoint is called for fetching JWTokens:
 - in a discord flow,
 - refresh jwt
*/

type User = {
	id: string;
	name: string;
};

async function discordLogin({ query }): Promise<User> {
	let user;
	// Discord fetch
	const {
		user: discordUser,
		access_token,
		refresh_token,
		scope,
		expires_in
	} = await API.getUserData(query.get('code'));

	if (!discordUser) {
		return;
	}

	const token = serverToken('oauth-token');
	// Check if the user exists
	console.log('Searching user:', discordUser);

	const {
		data: {
			user: [existingUser]
		}
	} = await gqlQuery({
		query: `
			query getUserByDiscordId($discordId: String!) {
				user(where: { discord_id: { _eq: $discordId } }) {
					id
					name
				}
			}
		`,
		variables: {
			discordId: discordUser.id
		},
		token
	});

	if (!existingUser) {
		console.log('creating user:', discordUser);
		// Create the user
		const {
			data: {
				user: {
					returning: [createdUser]
				}
			}
		} = await gqlQuery({
			query: `
				mutation createUser($name: String!, $discordUser: discord_insert_input!) {
					user: insert_user(objects: { name: $name, discord: { data: $discordUser } }) {
						returning {
							id
							name
						}
					}
				}
			`,
			variables: {
				name: discordUser.username,
				discordUser: Object.fromEntries(
					Object.entries(discordUser).filter(([key]) =>
						['id', 'username', 'discriminator', 'avatar', 'bot', 'system', 'email'].includes(key)
					)
				)
			},
			token
		});
		user = createdUser;
	} else {
		console.log('found user:', existingUser.name);
		user = existingUser;
		// Nuke existing tokens
		gqlQuery({
			query: `
				mutation removeTokens($id: uuid!) {
					delete_oauth_token(where: { user_id: { _eq: $id } }) {
						affected_rows
					}
				}
			`,
			variables: { id: user.id },
			token
		});
	}

	// Update the user token
	await gqlQuery({
		query: gql`
			mutation createToken($token: oauth_token_insert_input!) {
				insert_oauth_token_one(object: $token) {
					user_id
				}
			}
		`,
		variables: {
			token: {
				user_id: user.id,
				access_token,
				refresh_token,
				scope: scope.split(' '),
				expires: datetimeAfter(parseInt(expires_in))
			}
		},
		token
	});

	return user;
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query, headers }) {
	// Checks the oauth redirect code, creates or fetches the user, and stores the oauth token info.
	const { state } = getCookies(headers.cookie);

	let user;
	if (query.has('state') && query.has('code') && state === query.get('state')) {
		user = await discordLogin({ query });
	}

	console.log('gottne user?', user);

	if (query.has('application') && query.has('secret')) {
		// Tokens for the applications
		const application = query.get('application');
		const secret = query.get('secret');

		if (application === 'gatekeeper' && secret === process.env['GATEKEEPER_SECRET']) {
			return {
				status: 200,
				body: {
					token: createToken(
						{
							id: '-1',
							name: 'gatekeeper',
							roles: ['gatekeeper'],
							default_role: 'gatekeeper'
						},
						{
							expiresIn: '30 seconds',
							subject: '-1'
						}
					)
				}
			};
		}
	}

	// Check token
	const { token: cookieToken } = getCookies(headers.cookie);

	try {
		// Verify token
		if (cookieToken) {
			const JWTUser = await verifyToken(cookieToken, { ignoreExpiration: true });
			console.log('Got JWTUser', JWTUser);
		}
	} catch (e) {
		console.log('Invalid token');
	}

	if (!user) {
		return {
			status: 400,
			body: {
				message: 'Invalid parameters'
			}
		};
	}
	console.log('Got user, creating token:', user);

	const JWTUser = {
		id: user.id,
		name: user.name,
		roles: ['user'],
		default_role: 'user'
	};
	const JWToken = createToken(JWTUser, {
		expiresIn: '1 day',
		subject: user.id.toString()
	});

	// Create a JWT for the user session (a day)
	return {
		status: 200,
		headers: {
			'Set-Cookie': [
				setCookie('token', JWToken, { expires: datetimeAfter(60 * 60 * 25) }),
				setCookie('state', '', { expires: new Date(1970) })
			]
		},
		body: {
			user: JWTUser,
			token: JWToken
		}
	};
}

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
		user: [existingUser]
	} = await gqlQuery({
		query: `
			query getUserByDiscordId($discordId: String!) {
				user(where: { discord_id: { _eq: $discordId } }) {
					id
					discord_id
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
			user: {
				returning: [createdUser]
			}
		} = await gqlQuery({
			query: `
				mutation createUser($name: String!, $discordUser: discord_insert_input!) {
					user: insert_user(objects: {
						name: $name,
						discord: {
							data: $discordUser
							on_conflict:{
								constraint:discord_pkey,
								update_columns:[avatar, bot, discriminator, email, roles, system, username]
							}
						},
						
					}) {
						returning {
							id
							name
							discord_id
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
		query: `
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

			const {
				user: [existingUser]
			} = await gqlQuery({
				query: `
					query getUserById($id: uuid!) {
						user(where: { id: { _eq: $id } }) {
							id
							discord_id
							name
						}
					}
				`,
				variables: {
					id: JWTUser.id
				},
				token: serverToken('oauth-token')
			});
			user = existingUser;
			console.log('Existing user for refresh', user);
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

	let discordRoles = null;

	try {
		// Try fetching the user's discord roles from the gatekeeper
		const response = await fetch(`${process.env['GATEKEEPER_URL']}/check/${user.discord_id}`);
		console.log(process.env['GATEKEEPER_URL'], response.status);
		const data = await response.json();
		discordRoles = data.roles;
		console.log('Got roles:', discordRoles);
	} catch (e) {
		console.log("Failing to resolve the user's roles", e);
	}
	const roles = discordRoles?.includes('VCA') ? ['user'] : [];

	const JWTUser = {
		id: user.id,
		name: user.name,
		rolesOnDiscord: discordRoles,
		roles: roles,
		default_role: roles.length ? 'user' : null
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
				// Only delete state when set
				state && setCookie('state', '', { expires: new Date(1970) })
			]
		},
		body: {
			user: JWTUser,
			token: JWToken
		}
	};
}

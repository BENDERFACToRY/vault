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
		await gqlQuery({
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
	console.log("----- GET /token")
	const { state } = getCookies(headers.cookie);

	let user;
	if (query.has('state') && query.has('code') && state === query.get('state')) {
		user = await discordLogin({ query });
	}

	// Check token
	const { token: cookieToken } = getCookies(headers.cookie);

	try {
		// Verify token
		if (cookieToken) {
			console.log('----- Verify token')
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
		console.log('--- Invalid parameters')
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
		console.log(response.headers)
		if (response.headers.get('content-type').includes('application/json')) {
			const data = await response.json();
			discordRoles = data.roles;

			await gqlQuery({
				query: `
					mutation setRoles($id: String!, $roles: jsonb!) {
					update_discord_by_pk(
						pk_columns: { id:$id },
						_set: {
						roles: $roles
						}
					) {
						id roles
					}
				}`,
				variables: { id: user.discord_id, roles: discordRoles },
				token: serverToken('oauth-token')
			});

			console.log('Got roles:', discordRoles);
		} else {
			console.log("No content-type")
			console.log(await response.text())
		}
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
	console.log('--- Token ok', JWTUser)
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

import { getUserData } from '$lib/discord';
import { token, client, gql } from '$lib/graphql';
import { setCookie, getCookies, datetimeAfter } from '$lib/cookies';
import { withServerToken, createToken } from '$lib/jwt';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export const get = withServerToken(
	'oauth-token',
	token
)(async function get({ query, headers }) {
	// Checks the oauth redirect code, creates or fetches the user, and stores the oauth token info.
	const { state } = getCookies(headers.cookie);

	let user;
	if (!query.has('state') || (!query.has('code') && state !== query.get('state'))) {
		return {
			status: 400,
			body: {
				message: 'Invalid parameters'
			}
		};
	}

	const { user: oauthUser, access_token, refresh_token, scope, expires_in } = await getUserData(
		query.get('code')
	);
	const expires = datetimeAfter(parseInt(expires_in));

	if (!oauthUser) {
		return {
			status: 400,
			body: {
				message: 'Invalid oauth code'
			}
		};
	}

	// Check if the user exists
	const {
		user: [discordUser]
	} = await client.request(
		gql`
			query getUserByDiscordId($discordId: String!) {
				user(where: { discord_id: { _eq: $discordId } }) {
					id
					name
				}
			}
		`,
		{ discordId: oauthUser.id }
	);

	if (!discordUser) {
		// Create the user
		const {
			user: {
				returning: [createdUser]
			}
		} = await client.request(
			gql`
				mutation createUser($name: String!, $discordId: String!) {
					user: insert_user(objects: { name: $name, discord_id: $discordId }) {
						returning {
							id
							name
						}
					}
				}
			`,
			{
				name: oauthUser.username,
				discordId: oauthUser.id
			}
		);
		user = createdUser;
	} else {
		user = discordUser;
		// Nuke existing tokens
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

	// Update the user token
	await client.request(
		gql`
			mutation createToken($token: oauth_token_insert_input!) {
				insert_oauth_token_one(object: $token) {
					user_id
				}
			}
		`,
		{
			token: {
				user_id: user.id,
				access_token,
				refresh_token,
				scope: scope.split(' '),
				expires
			}
		}
	);

	const JWTUser = {
		id: user.id,
		name: user.name,
		roles: ['user'],
		default_role: 'user'
	};
	const JWToken = createToken(JWTUser, {
		subject: user.id
	});

	// Create a JWT for the user session (a day)
	return {
		status: 200,
		headers: {
			'Set-Cookie': [
				setCookie('token', JWToken),
				setCookie('state', '', { expires: new Date(1970) })
			]
		},
		body: {
			user: JWTUser,
			token: JWToken
		}
	};
});

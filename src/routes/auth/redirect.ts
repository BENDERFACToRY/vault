import { getUserData } from '$lib/discord';
import { token, client, gql } from '$lib/graphql';
import { serverToken, createToken } from '$lib/token';

const after = (seconds: number) => {
	const time = new Date();
	time.setSeconds(time.getSeconds() + seconds);
	return time;
};

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	let user;

	token.set(serverToken('oauth-redirect'));
	const { user: oauthUser, access_token, refresh_token, scope, expires_in } = await getUserData(
		query.get('state'),
		query.get('code')
	);

	const expires = after(parseInt(expires_in));

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
				name: user.username,
				discordId: user.id
			}
		);
		user = createdUser;
	} else {
		user = discordUser;
		// Nuke existing tokens
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

	const JWToken = createToken(
		{
			id: user.id,
			roles: ['user'],
			default_role: 'user'
		},
		{
			subject: user.id
		}
	);

	// Create a JWT for the user session (a day)
	return {
		status: 200,
		headers: {
			'Set-Cookie': `token=${JWToken}; Path=/; expires=${after(60 * 60 * 24)}; HttpOnly`
		},
		body: {
			token: JWToken,
			user
		}
	};
}

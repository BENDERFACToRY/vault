<script lang="ts">
	import { client, gql, getSubscriptionClient, token } from '$lib/graphql';
	import { session } from '$app/stores';

	const { subscribe } = getSubscriptionClient($token);

	const data = subscribe(gql`
		subscription {
			discord {
				username
				roles
			}
		}
	`);
</script>

<pre>{JSON.stringify($session, null, 2)}</pre>

{#await client.request(gql`
	query getLikes {
		like {
			media {
				id
			}
		}
	}
`)}
	<p>Loading</p>
{:then data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/await}

<article>
	<h2>Data:</h2>
	<pre>{JSON.stringify($data, null, 2)}</pre>
</article>

{#await client.request(gql`
	query getUser {
		user {
			id
			name
			comments {
				media {
					id
				}
				text
			}
			likes {
				media {
					title
				}
			}
			discord {
				username
				avatar
				bot
				discriminator
				email
				system
			}
		}
	}
`)}
	<p>Loading</p>
{:then data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/await}

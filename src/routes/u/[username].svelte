<script lang="ts">
	import { client, gql } from '$lib/graphql';
</script>

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

{#await client.request(gql`
	query getUser {
		user {
			name
		}
	}
`)}
	<p>Loading</p>
{:then data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/await}

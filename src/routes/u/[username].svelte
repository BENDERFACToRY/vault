<script lang="ts">
	// import { query } from 'svelte-apollo';
	import gql from 'graphql-tag';
	import { session } from '$app/stores';

	const likes = query(gql`
		query getLikes {
			like {
				media {
					id
				}
			}
		}
	`);

	const user = query(gql`
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
					roles
				}
			}
		}
	`);

	// const data = subscribe(gql`
	// 	subscription {
	// 		discord {
	// 			username
	// 			roles
	// 		}
	// 	}
	// `);
</script>

<pre>{JSON.stringify($session, null, 2)}</pre>

{#if $likes.loading}
	<p>Loading</p>
{:else if $likes.error}
	<p>Error: {$likes.error}</p>
{:else}
	<pre>{JSON.stringify($likes.data, null, 2)}</pre>
{/if}

<article>
	<h2>Data:</h2>
	<!-- <pre>{JSON.stringify($data, null, 2)}</pre> -->
</article>

{#if $user.loading}
	<p>Loading</p>
{:else if $user.error}
	<p>Error: {$user.error}</p>
{:else}
	<pre>{JSON.stringify($user.data, null, 2)}</pre>
{/if}

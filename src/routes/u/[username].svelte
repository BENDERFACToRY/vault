<script lang="ts">
	import { navigating } from '$app/stores';
	import { query, graphql, GetUser, AllUserLikes } from '$houdini';
	import { session } from '$app/stores';

	const { data: likes, error: likesError } = query<AllUserLikes>(graphql`
		query AllUserLikes {
			like {
				media {
					id
				}
			}
		}
	`);

	const { data: user, error: userError } = query<GetUser>(graphql`
		query GetUser {
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

{#if $navigating}
	<p>Loading</p>
{:else if $likesError}
	<p>Error: {$likesError}</p>
{:else}
	<pre>{JSON.stringify($likes, null, 2)}</pre>
{/if}

<article>
	<h2>Data:</h2>
	<!-- <pre>{JSON.stringify($data, null, 2)}</pre> -->
	{#if $navigating}
		<p>Loading</p>
	{:else if $userError}
		<p>Error: {$userError}</p>
	{:else}
		<pre>{JSON.stringify($user, null, 2)}</pre>
	{/if}
</article>

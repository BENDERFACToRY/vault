<script lang="ts">
	import { session } from '$app/stores';
	import { navigating } from '$app/stores';
	import { query, graphql, GetUser } from '$houdini';

	import Media from '$lib/Media.svelte';

	const { data, error } = query<GetUser>(graphql`
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
					media_id
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

	$: [user] = $data.user;
</script>

<article>
	{#if $navigating}
		<p>Loading</p>
	{:else}
		<h2>{user.name}</h2>
		<ul class="roles">
			{#each user.discord.roles as role}
				<li>{role}</li>
			{/each}
		</ul>
		<!-- <pre>{JSON.stringify($data, null, 2)}</pre> -->

		{#if user.likes}
			<Media
				where={{
					likes: {
						user_id: { _eq: $session.user.id }
					}
				}}
			/>
		{/if}
	{/if}
</article>

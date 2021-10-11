<script context="module" lang="ts">
	import { get } from 'svelte/store';
	import { session } from '$app/stores';
	// This is the function for the AllItems query.
	// Query variable functions must be named <QueryName>Variables.
	export function MyLikesVariables(): MyLikes$input {
		// make sure we recognize the value
		return {
			userId: get(session).user.id
		};
	}
</script>

<script lang="ts">
	import { query, mutation, graphql, MyLikes } from '$houdini';

	export let id;

	const { data, loading, error, refetch } = query<MyLikes>(graphql`
		query MyLikes($userId: uuid!) {
			like(where: { user_id: { _eq: $userId } }) {
				media_id
			}
		}
	`);

	$: likes = !($loading || $error) ? $data.like.map(({ media_id }) => media_id) : [];
	$: like = likes.includes(id);

	const addLike = mutation(
		graphql`
			mutation AddLike($id: uuid!) {
				insert_like(objects: { media_id: $id }) {
					returning {
						media_id
					}
				}
			}
		`
	);

	const removeLike = mutation(
		graphql`
			mutation RemoveLike($id: uuid!) {
				delete_like(where: { media_id: { _eq: $id } }) {
					returning {
						media_id
					}
				}
			}
		`
	);

	const toggle = async () => {
		if (like) {
			await removeLike({ id });
		} else {
			await addLike({ id });
		}
		refetch();
	};
</script>

<button class:like class="icon" on:click|stopPropagation={toggle}>
	{like ? 'favorite' : 'favorite_border'}
</button>

<style>
	button {
		background: none;
		filter: var(--icon-filter-gray-light);

		transition: filter 0.3s ease-out;
	}
	:global(tr:hover) button,
	:global(tr:focus) button {
		background: none;
		filter: var(--icon-filter-gray-dark);
	}

	.like {
		filter: var(--icon-filter-red);
	}
	:global(tr:hover) .like {
		filter: var(--icon-filter-red-light);
	}
</style>

<script lang="ts">
	import { query, mutation } from 'svelte-apollo';
	import gql from 'graphql-tag';
	import { session } from '$app/stores';
	export let id;
	export let refetch;

	const { user } = $session;
	// TODO: This needs to be a singleton
	const GET_LIKES = gql`
		query myLikes($userId: uuid!) {
			like(where: { user_id: { _eq: $userId } }) {
				media_id
			}
		}
	`;
	const likesQuery = query(GET_LIKES, { variables: { userId: user.id } });

	$: likes = !($likesQuery.loading || $likesQuery.error)
		? $likesQuery.data.like.map(({ media_id }) => media_id)
		: [];
	$: like = likes.includes(id);

	export const addLike = mutation(
		gql`
			mutation addLike($id: uuid!) {
				insert_like(objects: { media_id: $id }) {
					affected_rows
				}
			}
		`,
		{
			refetchQueries: [GET_LIKES]
		}
	);

	export const removeLike = mutation(
		gql`
			mutation removeLike($id: uuid!) {
				delete_like(where: { media_id: { _eq: $id } }) {
					affected_rows
				}
			}
		`,
		{
			refetchQueries: [GET_LIKES]
		}
	);

	const toggle = () => {
		if (like) {
			removeLike({ variables: { id } });
		} else {
			addLike({ variables: { id } });
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

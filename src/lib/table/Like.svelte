<script lang="ts">
	// import { query, mutation } from 'svelte-apollo';
	import { query, graphql, MyLikes, MyLikes$input } from '$houdini';

	export let id;
	export let refetch;

	const { data, loading, error } = query<MyLikes>(graphql`
		query MyLikes($userId: uuid!) {
			like(where: { user_id: { _eq: $userId } }) {
				media_id
			}
		}
	`);
	//  { variables: { userId: user.id } });

	$: likes = !($loading || $error) ? $data.like.map(({ media_id }) => media_id) : [];
	$: like = likes.includes(id);

	export const addLike = () => {
		console.log('Adding like');
	};
	export const removeLike = () => {
		console.log('removing like');
	};
	// export const addLike = mutation(
	// 	gql`
	// 		mutation addLike($id: uuid!) {
	// 			insert_like(objects: { media_id: $id }) {
	// 				affected_rows
	// 			}
	// 		}
	// 	`,
	// 	{
	// 		refetchQueries: [MY_LIKES]
	// 	}
	// );

	// export const removeLike = mutation(
	// 	gql`
	// 		mutation removeLike($id: uuid!) {
	// 			delete_like(where: { media_id: { _eq: $id } }) {
	// 				affected_rows
	// 			}
	// 		}
	// 	`,
	// 	{
	// 		refetchQueries: [MY_LIKES]
	// 	}
	// );

	const toggle = () => {
		if (like) {
			removeLike({ variables: { id } });
		} else {
			addLike({ variables: { id } });
		}
		refetch();
	};
</script>

<script context="module" lang="ts">
	import { get } from 'svelte/store'
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

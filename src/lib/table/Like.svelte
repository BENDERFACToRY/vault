<script lang="ts">
	import { fragment, mutation, graphql, AllLikes } from '$houdini';

	export let id;
	export let likes: AllLikes;

	const data = fragment(
		graphql`
			fragment AllLikes on media @arguments(userId: { type: "uuid!" }) {
				likes(where: { user_id: { _eq: $userId } }) {
					media_id
				}
			}
		`,
		likes
	);

	// const { data, loading, error } = query<MyLikes>(graphql`
	// 	query MyLikes($userId: uuid!) {
	// 		like(where: { user_id: { _eq: $userId } }) {
	// 			media_id
	// 		}
	// 	}
	// `);

	// $: likes = !($loading || $error) ? $data.like.map(({ media_id }) => media_id) : [];
	// $: like = likes.includes(id);

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

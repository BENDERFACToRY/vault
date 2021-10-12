<script lang="ts">
	import { mutation, graphql } from '$houdini';

	export let id;
	export let liked;
	export let refetch;

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
		if (liked) {
			await removeLike({ id });
		} else {
			await addLike({ id });
		}
		refetch();
	};
</script>

<button class:liked class="icon" on:click|stopPropagation={toggle}>
	{liked ? 'favorite' : 'favorite_border'}
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

	.liked {
		filter: var(--icon-filter-red);
	}
	:global(tr:hover) .liked {
		filter: var(--icon-filter-red-light);
	}
</style>

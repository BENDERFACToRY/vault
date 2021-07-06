<script lang="ts">
	import { likes, addLike, removeLike } from '$lib/user';
	export let id;

	$: like = $likes.includes(id);

	const toggle = () => {
		if (like) {
			$likes = $likes.filter((_id) => _id !== id);
			removeLike(id);
		} else {
			$likes = [...$likes, id];
			addLike(id);
		}
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

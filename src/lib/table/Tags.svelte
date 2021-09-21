<script lang="ts">
	export let tags = [];
</script>

{#if tags}
	{#each tags as tag}
		<span class="tag">{tag}</span>
	{/each}
{/if}

<style>
	.tag {
		background: var(--black);
		color: var(--white);
		padding: 2px 4px;
		border-radius: 9px;
		margin: 2px;
	}
</style>

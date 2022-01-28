<script lang="ts">
	import { currentTrack } from '$lib/Player.svelte';

	export let track;

	function handlePlay() {
		if ($currentTrack) {
			$currentTrack.isPlaying = !$currentTrack.isPlaying;
		}

		if ($currentTrack != track) {
			if ($currentTrack) {
				$currentTrack.isPlaying = false;
			}
			$currentTrack = track;
			$currentTrack.isPlaying = true;
		}
	}
</script>

<button class:playing={$currentTrack === track} class="icon" on:click|stopPropagation={handlePlay}>
	{#if track.isPlaying}
		pause
	{:else}
		play_arrow
	{/if}
</button>

<style>
	button {
		margin: 0;
	}
	.playing {
		background: none;
		filter: var(--icon-filter-red);
	}
</style>

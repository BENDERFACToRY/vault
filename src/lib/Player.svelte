<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	export const currentTrack = writable();
</script>

<script lang="ts">
	const autoplay = (audio: HTMLAudioElement, currentTrack) => {
		const play = (currentTrack) => {
			if (currentTrack) {
				audio.load();
				audio.play();
			}
		};

		play(currentTrack);

		return {
			update: play
		};
	};

	$: baseSrc = $currentTrack && `https://ipfs.benderfactory.com/${$currentTrack.data_folder}`;
	$: vorbis =
		baseSrc && $currentTrack.stereo_mix.vorbis && `${baseSrc}/${$currentTrack.stereo_mix.vorbis}`;
	$: mp3 = baseSrc && $currentTrack.stereo_mix.mp3 && `${baseSrc}/${$currentTrack.stereo_mix.mp3}`;
</script>

<article>
	{#if $currentTrack}
		<audio use:autoplay={$currentTrack} controls>
			<track kind="captions" src="data:%5b%e2%99%ab music %e2%99%ab%5d" />

			{#if vorbis}
				<source src={vorbis} type="audio/ogg; codecs=vorbis" />
			{/if}

			{#if mp3}
				<source src={mp3} type="audio/mpeg" />
			{/if}

			Your browser does not support the <code>audio</code> element.
		</audio>
	{/if}
</article>

<style>
	audio {
		width: 100%;
	}
</style>

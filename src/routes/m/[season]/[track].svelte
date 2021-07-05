<script lang="ts" context="module">
	export async function load({ fetch, page }) {
		const { season, track } = page.params;

		const req = await fetch('/tracks.json');
		const recordings = await req.json();

		const path = `${season}/${track}`;
		const recording = recordings.find(({ data_folder }) => data_folder === path);
		return {
			props: {
				...recording,
				path: `https://ipfs.benderfactory.com/${recording.data_folder}`
			}
		};
	}
</script>

<script lang="ts">
	import { Table, Tags, Files } from '$lib/table';
	import { formatDuration } from '$lib/util';

	export let path;

	export let title;

	export let tags = [];
	export let bpm;
	export let youtube_url;
	export let recorded_date;

	export let torrent;
	export let stereo_mix;
	export let tracks;
</script>

<h2>{title}</h2>

{path}

<p>Recorded on {recorded_date}</p>
{#if youtube_url}
	<a href={youtube_url}>Watch on Youtube</a>
{/if}

<p>{formatDuration(stereo_mix.media_info.Duration)}</p>
<p>
	{stereo_mix.media_info.Channels}ch {stereo_mix.media_info.SamplingRate}kHz {stereo_mix.media_info
		.BitDepth}bit
</p>
{#if bpm}
	<p>{bpm} bpm</p>
{/if}

<Tags {tags} />

{#if torrent}
	<p>Download <a href="{path}/{torrent}">.torrent</a> with all flac files</p>
{/if}

<Table
	columns={[
		// { label: '', getter: () => ''},
		{ label: 'track', getter: ({ name, id }) => `track ${id}: ${name}` },
		// 'player',
		{ label: 'files', component: Files, props: (track) => ({ basepath: path, ...track }) }
	]}
	data={[stereo_mix, ...tracks]}
/>

<h3>Terms of Service: <a href="{path}/ToS.txt">must read before downloading</a></h3>

<script context="module">
	export async function load({ fetch }) {
		const req = await fetch('/tracks.json');
		return {
			props: {
				recordings: await req.json()
			}
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { Table, Play, Like, Tags, Link } from '$lib/table';
	import { currentTrack } from '$lib/Player.svelte';
	import { formatDuration } from '$lib/util';

	export let recordings = [];

	const getMetadata = ({ stereo_mix }) => `
    ${stereo_mix.media_info.Channels}ch
    ${stereo_mix.media_info.SamplingRate / 1000}Khz
    ${stereo_mix.media_info.BitDepth}bit
  `;
</script>

<Table
	on:click={({ detail: { data_folder } }) => goto(`m/${data_folder}`)}
	columns={[
		{ label: '', component: Play, props: (track) => ({ track }) },
		{
			label: 'title',
			component: Link,
			props: ({ title, data_folder }) => ({ href: `m/${data_folder}`, text: title })
		},
		{ label: 'stems', getter: ({ tracks }) => tracks.length },
		{
			label: 'duration',
			getter: ({ stereo_mix }) => formatDuration(stereo_mix.media_info.Duration),
			style: 'text-align: right;'
		},
		{ label: 'metadata', getter: getMetadata },
		{ label: 'tags', component: Tags, props: ({ tags }) => ({ tags }) },
		{ label: '', component: Like, props: ({ title }) => ({ title }) }
	]}
	rowClass={(row) => ({
		active: row === $currentTrack
	})}
	data={recordings}
/>

<style>
	:global(table tr.active) {
		background: var(--gray-light);
	}
</style>

<script context="module">
	import { client, gql } from '$lib/graphql';

	export async function load() {
		const { media } = await client.request(gql`
			query allTracks {
				media {
					title
					bpm
					data_folder
					id
					recorded_date
					stereo_mix
					tracks
				}
			}
		`);

		return {
			props: {
				media
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';

	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Table, Play, Like, Tags, Link } from '$lib/table';
	import { currentTrack } from '$lib/Player.svelte';
	import { formatDuration } from '$lib/util';

	export let media = [];

	const getMetadata = ({ stereo_mix }) => `
    ${stereo_mix.media_info.Channels}ch
    ${stereo_mix.media_info.SamplingRate / 1000}Khz
    ${stereo_mix.media_info.BitDepth}bit
  `;

	onMount(async () => {
		if ($page.query.has('code') && $page.query.has('state')) {
			// It's an oauth redirect call.
			// Resolve the token and redirect the user to a clean url
			const params = new URLSearchParams({
				code: $page.query.get('code'),
				state: $page.query.get('state')
			});

			const response = await fetch(`/auth/token?${params}`);
			if (response.ok) {
				$session = {
					...$session,
					...(await response.json())
				};
				goto('/');
			}
		}
	});
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
		{ label: '', component: Like, props: ({ id }) => ({ id }) }
	]}
	rowClass={(row) => ({
		active: row === $currentTrack
	})}
	data={media}
/>

<style>
	:global(table tr.active) {
		background: var(--gray-light);
	}
</style>

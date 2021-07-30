<script lang="ts">
	import gql from 'graphql-tag';
	import { query } from 'svelte-apollo';

	import { page } from '$app/stores';

	import { Table, Tags, Files } from '$lib/table';
	import { formatDuration } from '$lib/util';

	const GET_TRACKS = gql`
		query getTrack($data_folder: String!) {
			media(where: { data_folder: { _eq: $data_folder } }) {
				title
				bpm
				data_folder
				id
				recorded_date
				stereo_mix
				tracks
				youtube_url
				torrent
			}
		}
	`;
	let recording, path;

	$: ({ season, track } = $page.params);
	$: if (tracksQuery && season && track) {
		tracksQuery.refetch({ data_folder: `${season}/${track}` });
	}

	const tracksQuery = query(GET_TRACKS, {
		variables: { data_folder: `${season}/${track}` }
	});
	$: if (!($tracksQuery.loading || $tracksQuery.error)) {
		const [r] = $tracksQuery.data?.media;
		recording = r;
		console.log(recording);
	}
	$: path = recording && `https://ipfs.benderfactory.com/${recording.data_folder}`;
</script>

{#if $tracksQuery.loading}
	<p>Loading</p>
{:else if recording}
	<h2>{recording.title}</h2>

	{path}

	{#if recording.recorded_date}
		<p>Recorded on {recording.recorded_date}</p>
	{/if}

	{#if recording.youtube_url}
		<a href={recording.youtube_url}>Watch on Youtube</a>
	{/if}

	<p>{formatDuration(recording.stereo_mix.media_info.Duration)}</p>
	<p>
		{recording.stereo_mix.media_info.Channels}ch {recording.stereo_mix.media_info.SamplingRate}kHz {recording
			.stereo_mix.media_info.BitDepth}bit
	</p>
	{#if recording.bpm}
		<p>{recording.bpm} bpm</p>
	{/if}

	<Tags tags={recording.tags} />

	{#if recording.torrent}
		<p>Download <a href="{recording.path}/{recording.torrent}">.torrent</a> with all flac files</p>
	{/if}

	<Table
		columns={[
			// { label: '', getter: () => ''},
			{ label: 'track', getter: ({ name, id }) => `track ${id}: ${name}` },
			// 'player',
			{
				label: 'files',
				component: Files,
				props: (track) => ({ basepath: recording.path, ...track })
			}
		]}
		data={[recording.stereo_mix, ...recording.tracks]}
	/>

	<h3>Terms of Service: <a href="{recording.path}/ToS.txt">must read before downloading</a></h3>
{/if}

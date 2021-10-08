<script lang="ts" context="module">
	export function GetTrackVariables({ page }) {
		const { season, track } = page.params;

		return {
			data_folder: `${season}/${track}`
		};
	}
</script>

<script lang="ts">
	import { graphql, query, GetTrack } from '$houdini';

	import { page } from '$app/stores';

	import { Table, Tags, Files } from '$lib/table';
	import { formatDuration } from '$lib/util';

	let recording, path;

	// $: if (tracksQuery && season && track) {
	// 	tracksQuery.refetch({ data_folder: `${season}/${track}` });
	// }

	const { data, loading, error } = query<GetTrack>(graphql`
		query GetTrack($data_folder: String!) {
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
	`);
	$: if (!($loading || $error)) {
		const [r] = $data?.media;
		recording = r;
	}
	$: path = recording && `https://ipfs.benderfactory.com/${recording.data_folder}`;
</script>

{#if $loading}
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
		key="id"
		columns={[
			// { label: '', getter: () => ''},
			{ label: 'track', getter: ({ name, id }) => `track ${id}: ${name}` },
			// 'player',
			{
				label: 'files',
				component: Files,
				props: (track) => ({
					basepath: path,
					flac: track.flac,
					flac_bytes: track.flac_bytes,
					vorbis: track.vorbis,
					ogg_bytes: track.ogg_bytes,
					mp3: track.mp3,
					mp3_bytes: track.mp3_bytes
				})
			}
		]}
		data={[recording.stereo_mix, ...recording.tracks]}
	/>

	<h3>Terms of Service: <a href="{path}/ToS.txt">must read before downloading</a></h3>
{/if}

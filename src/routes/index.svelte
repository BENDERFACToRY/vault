<script lang="ts">
	import { onMount } from 'svelte';

	import { query, graphql, AllTracks } from '$houdini';

	import { page, session } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Table, Play, Like, Tags, Link } from '$lib/table';
	import { currentTrack } from '$lib/Player.svelte';
	import { formatDuration } from '$lib/util';

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
				const data = await response.json();
				$session = {
					...$session,
					...data
				};
				goto('/');
			}
		}
	});

	const { data, loading, error } = query<AllTracks>(graphql`
		query AllTracks {
			media(order_by: [{ likes_aggregate: { count: desc } }, { title: asc }]) {
				title
				bpm
				data_folder
				id
				recorded_date
				stereo_mix
				tracks
				likes_aggregate {
					aggregate {
						count
					}
				}
			}
		}
	`);

	$: {
		console.log($data.media);
	}
</script>

{#if $session.user}
	{#if $loading}
		<p>Loading</p>
	{:else if $error}
		<p>Error: {$error}</p>
	{:else}
		<Table
			key="id"
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
				{
					label: 'likes',
					getter: ({
						likes_aggregate: {
							aggregate: { count }
						}
					}) => count
				},
				{ label: '', component: Like, props: ({ id }) => ({ id, refetch: () => media.refetch() }) }
			]}
			rowClass={(row) => ({
				active: row === $currentTrack
			})}
			data={$data.media}
		/>
	{/if}
{:else}
	<p>You need to login using <a href="auth/login">discord</a> in order to view any tracks</p>
{/if}

<style>
	:global(table tr.active) {
		background: var(--gray-light);
	}
</style>

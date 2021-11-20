<script context="module" lang="ts">
	export function AllTracksVariables({ props }) {
		return props;
	}
</script>

<script lang="ts">
	import { goto, prefetch } from '$app/navigation';

	import { query, graphql, AllTracks } from '$houdini';

	import { Table, Play, Like, Tags, Link } from '$lib/table';
	import { currentTrack } from '$lib/Player.svelte';
	import { formatDuration } from '$lib/util';

	export let where = {};
	export let order_by = [{ title: 'asc' }];
	let order = {
		column: 'title',
		direction: 'asc'
	};

	const getMetadata = ({ stereo_mix }) => `
		${stereo_mix.media_info.Channels}ch
		${stereo_mix.media_info.SamplingRate / 1000}Khz
		${stereo_mix.media_info.BitDepth}bit
	`;

	const { data, loading, error, refetch } = query<AllTracks>(graphql`
		query AllTracks(
			$where: media_bool_exp
			$order_by: [media_order_by!] = [{ likes_aggregate: { count: desc } }, { title: asc }]
		) {
			media(order_by: $order_by, where: $where) {
				title
				bpm
				data_folder
				id
				recorded_date
				stereo_mix
				tracks
				likes_count
				liked
			}
		}
	`);

	const columns = [
		{ label: '', component: Play, props: (track) => ({ track }) },
		{
			label: 'title',
			order: (dir) => [{ title: dir }],
			component: Link,
			props: ({ title, data_folder }) => ({ href: `/m/${data_folder}`, text: title })
		},
		{ label: 'stems', order: (dir) => [{ tracks: dir }], getter: ({ tracks }) => tracks.length },
		{
			label: 'duration',
			getter: ({ stereo_mix }) => formatDuration(stereo_mix.media_info.Duration),
			style: 'text-align: right;'
		},
		{ label: 'metadata', getter: getMetadata },
		{
			label: 'tags',
			order: (dir) => [{ tags_aggregate: { count: dir } }],
			component: Tags,
			props: ({ tags }) => ({ tags })
		},
		{
			label: 'likes',
			order: (dir) => [{ likes_aggregate: { count: dir } }, { title: 'asc' }],
			getter: ({ likes_count }) => likes_count
		},
		{
			label: '',
			component: Like,
			props: ({ id, liked }) => ({ id, liked, refetch })
		}
	];

	$: if (order) {
		const column = columns.find((column) => column.label === order.column);
		if (column.order) {
			order_by = column.order(order.direction);
			refetch({
				order_by
			});
		}
	}
</script>

{#if $data}
	<Table
		key="id"
		on:focus={({ detail: { data_folder } }) => prefetch(`/m/${data_folder}`)}
		on:click={({ detail: { data_folder } }) => goto(`/m/${data_folder}`)}
		bind:order
		{columns}
		rowClass={(row) => ({
			active: row === $currentTrack
		})}
		data={$data.media}
	/>
{:else if $error}
	<p>Error: {JSON.stringify($error)}</p>
{:else if $loading}
	<p>Loading</p>
{/if}

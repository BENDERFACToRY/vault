// Scrapes IPFS for all media

import gql from 'graphql-tag';
import { createClient } from '$lib/graphql';
import { serverToken } from '$lib/jwt';
import type { EndpointOutput } from '@sveltejs/kit';

const cache = new Map();
const { client, token } = createClient();
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
const fetchIPFS = async (url, { retries = 3, retryTime = 1000, ...opts } = {}) => {
	if (cache.has(url)) {
		return cache.get(url);
	}

	try {
		console.log('fetch:', url, retries);
		const res = await fetch(url, opts);
		if (res.status === 200) {
			const data = await res.json();
			cache.set(url, data);
			return data;
		} else {
			console.log('Wrong status', url, res.status);
		}
	} catch (e) {
		console.log('fail', retries);
		await wait(retryTime);
		return await fetchIPFS(url, { ...opts, retries: retries - 1, retryTime });
	}
};
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(): Promise<EndpointOutput> {
	const seasons = await fetchIPFS(`https://ipfs.benderfactory.com/metadata.json`);

	const data = await Promise.all(
		seasons.map(async (season) => {
			const data = await fetchIPFS(`https://ipfs.benderfactory.com/${season.path}/metadata.json`);
			return {
				path: season.path,
				...data
			};
		})
	);

	const tracks = data.flatMap(({ title, path, recordings }) =>
		recordings.map((recording) => ({
			...recording,
			season: title,
			data_folder: `${path}/${recording.data_folder}`
		}))
	);
	token.set(serverToken('scrape-ipfs'));
	const body = await client.mutate({
		mutation: gql`
			mutation updateMedia($tracks: [media_insert_input!]!) {
				insert_media(
					objects: $tracks
					on_conflict: {
						constraint: media_data_folder_key
						update_columns: [
							bpm
							recorded_date
							season
							stereo_mix
							title
							torrent
							tracks
							youtube_url
						]
					}
				) {
					affected_rows
				}
			}
		`,
		variables: {
			tracks: tracks.map(({ tags, recorded_date, ...rest }) => rest)
		}
	});
	return {
		body: body.data
	};
}

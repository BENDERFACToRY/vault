// Scrapes IPFS for all media
import { query } from '$lib/graphql';
import { serverToken } from '$lib/jwt';

const cache = new Map();

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

		if (retries) {
			await wait(retryTime);
			return await fetchIPFS(url, { ...opts, retries: retries - 1, retryTime });
		}

		console.log("Failing to fetch", e)
	}
};

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	try {
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
		const token = serverToken('scrape-ipfs');
		const body = await query({
			query: `
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
			},
			token
		});
		return {
			body
		};
	} catch (e) {
		return {
			status: 500,
			body: {
				error: 'Failed to scrape'
			}
		}
	}
}

export type allTracks = {
	readonly input: null;
	readonly result: allTracks$result;
};

export type allTracks$result = {
	readonly media: {
		readonly title: string;
		readonly bpm: string | null;
		readonly data_folder: string;
		readonly id: string;
		readonly recorded_date: string | null;
		readonly stereo_mix: string;
		readonly tracks: string;
		readonly likes_aggregate: {
			readonly aggregate: {
				readonly count: number;
			} | null;
		};
	}[];
};

export default {
	name: 'AllTracks',
	kind: 'HoudiniQuery',
	hash: '1fe8996ee42c81a3f4cfb98d512ba42f83ffdc2938d59ab5c32207403b1d38af',

	raw: `query AllTracks {
  media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}]) {
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
`,

	rootType: 'query_root',

	selection: {
		media: {
			type: 'media',
			keyRaw: 'media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}])',

			fields: {
				title: {
					type: 'String',
					keyRaw: 'title'
				},

				bpm: {
					type: 'String',
					keyRaw: 'bpm'
				},

				data_folder: {
					type: 'String',
					keyRaw: 'data_folder'
				},

				id: {
					type: 'uuid',
					keyRaw: 'id'
				},

				recorded_date: {
					type: 'date',
					keyRaw: 'recorded_date'
				},

				stereo_mix: {
					type: 'jsonb',
					keyRaw: 'stereo_mix'
				},

				tracks: {
					type: 'jsonb',
					keyRaw: 'tracks'
				},

				likes_aggregate: {
					type: 'like_aggregate',
					keyRaw: 'likes_aggregate',

					fields: {
						aggregate: {
							type: 'like_aggregate_fields',
							keyRaw: 'aggregate',

							fields: {
								count: {
									type: 'Int',
									keyRaw: 'count'
								}
							}
						}
					}
				}
			}
		}
	},

	policy: 'NetworkOnly'
};

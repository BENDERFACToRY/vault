export default {
	name: 'allTracks',
	kind: 'HoudiniQuery',
	hash: '30d369d7dab93ff45e516a22b6cf2cedf9b6e2b2222ab0455f21cae20710202e',

	raw: `query allTracks {
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

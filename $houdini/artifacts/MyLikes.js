export default {
	name: 'MyLikes',
	kind: 'HoudiniQuery',
	hash: '3f105005b4086e22a91bde78da486abc7835ddefd32c5fd32b25a9976dc928cb',

	raw: `query MyLikes($userId: uuid!) {
  like(where: {user_id: {_eq: $userId}}) {
    media_id
  }
}
`,

	rootType: 'query_root',

	selection: {
		like: {
			type: 'like',
			keyRaw: 'like(where: {user_id: {_eq: $userId}})',

			fields: {
				media_id: {
					type: 'uuid',
					keyRaw: 'media_id'
				}
			}
		}
	},

	input: {
		fields: {
			userId: 'uuid'
		},

		types: {}
	},

	policy: 'NetworkOnly'
};

export default {
	name: 'myLikes',
	kind: 'HoudiniQuery',
	hash: '9367cb8a4f4b761081a7ff69713d81d293f6896305b5750796372a5917b5015f',

	raw: `query myLikes($userId: uuid!) {
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

export default {
    name: "Likes",
    kind: "HoudiniFragment",
    hash: "037f3cd17a966e83677ffb09576ff8bbb24a02f494b313122097a6ac25f42381",

    raw: `fragment Likes on media {
  likes(where: {user_id: {_eq: $userId}}) {
    media_id
  }
}
`,

    rootType: "media",

    selection: {
        likes: {
            type: "like",
            keyRaw: "likes(where: {user_id: {_eq: $userId}})",

            fields: {
                media_id: {
                    type: "uuid",
                    keyRaw: "media_id"
                }
            }
        }
    }
};
export default {
    name: "AllLikes",
    kind: "HoudiniFragment",
    hash: "c631aa644f7004f28c8342f0246aa63677a3fa9a62568d0986d4116c6b66af53",

    raw: `fragment AllLikes on media {
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
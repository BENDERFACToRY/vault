export default {
    name: "AllUserLikes",
    kind: "HoudiniQuery",
    hash: "472f2ff0f5a652d65f015938b08c693260a928126d26b52b8d0bb8d6830b13b1",

    raw: `query AllUserLikes {
  like {
    media {
      id
    }
  }
}
`,

    rootType: "query_root",

    selection: {
        like: {
            type: "like",
            keyRaw: "like",

            fields: {
                media: {
                    type: "media",
                    keyRaw: "media",

                    fields: {
                        id: {
                            type: "uuid",
                            keyRaw: "id"
                        }
                    }
                }
            }
        }
    },

    policy: "NetworkOnly"
};
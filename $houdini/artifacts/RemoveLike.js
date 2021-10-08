export default {
    name: "RemoveLike",
    kind: "HoudiniMutation",
    hash: "9ee60b8400939015fad683ca31fd95b240fde7b8a2958a9e2207e5aecc7c820c",

    raw: `mutation RemoveLike($id: uuid!) {
  delete_like(where: {media_id: {_eq: $id}}) {
    returning {
      media_id
    }
  }
}
`,

    rootType: "mutation_root",

    selection: {
        delete_like: {
            type: "like_mutation_response",
            keyRaw: "delete_like(where: {media_id: {_eq: $id}})",

            fields: {
                returning: {
                    type: "like",
                    keyRaw: "returning",

                    fields: {
                        media_id: {
                            type: "uuid",
                            keyRaw: "media_id"
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "uuid"
        },

        types: {}
    }
};
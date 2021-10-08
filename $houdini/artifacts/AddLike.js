export default {
    name: "AddLike",
    kind: "HoudiniMutation",
    hash: "ca2ea304853cc051f7d33634a4825fe098971c726a0d8a8144777a7f3e9f614a",

    raw: `mutation AddLike($id: uuid!) {
  insert_like(objects: {media_id: $id}) {
    returning {
      media_id
    }
  }
}
`,

    rootType: "mutation_root",

    selection: {
        insert_like: {
            type: "like_mutation_response",
            keyRaw: "insert_like(objects: {media_id: $id})",

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
export default {
    name: "removeLike",
    kind: "HoudiniMutation",
    hash: "c4d5a07d9d4696372f0cccda338b1df97b1a079e96c49a4bed9155754c7aa9f4",

    raw: `mutation removeLike($id: uuid!) {
  delete_like(where: {media_id: {_eq: $id}}) {
    affected_rows
  }
}
`,

    rootType: "mutation_root",

    selection: {
        delete_like: {
            type: "like_mutation_response",
            keyRaw: "delete_like(where: {media_id: {_eq: $id}})",

            fields: {
                affected_rows: {
                    type: "Int",
                    keyRaw: "affected_rows"
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
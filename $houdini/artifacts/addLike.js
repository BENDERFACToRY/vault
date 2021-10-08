export default {
    name: "addLike",
    kind: "HoudiniMutation",
    hash: "90ef8ba23c3b9759c4a63d135fb3ae67245c9efd72b5b1272d0ebb25a36efb92",

    raw: `mutation addLike($id: uuid!) {
  insert_like(objects: {media_id: $id}) {
    affected_rows
  }
}
`,

    rootType: "mutation_root",

    selection: {
        insert_like: {
            type: "like_mutation_response",
            keyRaw: "insert_like(objects: {media_id: $id})",

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
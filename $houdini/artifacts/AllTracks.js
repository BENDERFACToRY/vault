export default {
    name: "AllTracks",
    kind: "HoudiniQuery",
    hash: "5986c716277b5b530ff43d64b4f3d6d5f4ec2f796f7a71eec3971cc0cd22e8b7",

    raw: `query AllTracks {
  media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}]) {
    title
    bpm
    data_folder
    id
    recorded_date
    stereo_mix
    tracks
    likes_count
    liked
  }
}
`,

    rootType: "query_root",

    selection: {
        media: {
            type: "media",
            keyRaw: "media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}])",

            fields: {
                title: {
                    type: "String",
                    keyRaw: "title"
                },

                bpm: {
                    type: "String",
                    keyRaw: "bpm"
                },

                data_folder: {
                    type: "String",
                    keyRaw: "data_folder"
                },

                id: {
                    type: "uuid",
                    keyRaw: "id"
                },

                recorded_date: {
                    type: "date",
                    keyRaw: "recorded_date"
                },

                stereo_mix: {
                    type: "jsonb",
                    keyRaw: "stereo_mix"
                },

                tracks: {
                    type: "jsonb",
                    keyRaw: "tracks"
                },

                likes_count: {
                    type: "Int",
                    keyRaw: "likes_count"
                },

                liked: {
                    type: "Boolean",
                    keyRaw: "liked"
                }
            }
        }
    },

    policy: "NetworkOnly"
};
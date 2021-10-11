export default {
    name: "AllTracks",
    kind: "HoudiniQuery",
    hash: "fbff2fbb120e209a53218d091d15a7f66386cfe036aee4a119c05d16e690cc12",

    raw: `query AllTracks($userId: uuid!) {
  media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}]) {
    title
    bpm
    data_folder
    id
    recorded_date
    stereo_mix
    tracks
    likes_aggregate {
      aggregate {
        count
      }
    }
    ...AllLikes_3K7mRP
  }
}

fragment AllLikes_3K7mRP on media {
  likes(where: {user_id: {_eq: $userId}}) {
    media_id
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

                likes_aggregate: {
                    type: "like_aggregate",
                    keyRaw: "likes_aggregate",

                    fields: {
                        aggregate: {
                            type: "like_aggregate_fields",
                            keyRaw: "aggregate",

                            fields: {
                                count: {
                                    type: "Int",
                                    keyRaw: "count"
                                }
                            }
                        }
                    }
                },

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
        }
    },

    input: {
        fields: {
            userId: "uuid"
        },

        types: {}
    },

    policy: "NetworkOnly"
};
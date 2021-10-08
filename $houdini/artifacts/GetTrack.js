export default {
    name: "GetTrack",
    kind: "HoudiniQuery",
    hash: "0de2bce9e30eaa3b5add69b12313fa83c86dc77ab5a1ab52d42c5da2833c094d",

    raw: `query GetTrack($data_folder: String!) {
  media(where: {data_folder: {_eq: $data_folder}}) {
    title
    bpm
    data_folder
    id
    recorded_date
    stereo_mix
    tracks
    youtube_url
    torrent
  }
}
`,

    rootType: "query_root",

    selection: {
        media: {
            type: "media",
            keyRaw: "media(where: {data_folder: {_eq: $data_folder}})",

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

                youtube_url: {
                    type: "String",
                    keyRaw: "youtube_url"
                },

                torrent: {
                    type: "String",
                    keyRaw: "torrent"
                }
            }
        }
    },

    input: {
        fields: {
            data_folder: "String"
        },

        types: {}
    },

    policy: "NetworkOnly"
};
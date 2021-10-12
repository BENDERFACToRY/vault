export default {
    name: "AllTracks",
    kind: "HoudiniQuery",
    hash: "67c52b0efdf383b4d07b487aebbcded4cb4e2320c6c6a749e74c1ada6d8fd678",

    raw: `query AllTracks($where: media_bool_exp) {
  media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}], where: $where) {
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
            keyRaw: "media(order_by: [{likes_aggregate: {count: desc}}, {title: asc}], where: $where)",

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

    input: {
        fields: {
            where: "media_bool_exp"
        },

        types: {
            String_comparison_exp: {
                _eq: "String",
                _gt: "String",
                _gte: "String",
                _ilike: "String",
                _in: "String",
                _iregex: "String",
                _is_null: "Boolean",
                _like: "String",
                _lt: "String",
                _lte: "String",
                _neq: "String",
                _nilike: "String",
                _nin: "String",
                _niregex: "String",
                _nlike: "String",
                _nregex: "String",
                _nsimilar: "String",
                _regex: "String",
                _similar: "String"
            },

            timestamptz_comparison_exp: {
                _eq: "timestamptz",
                _gt: "timestamptz",
                _gte: "timestamptz",
                _in: "timestamptz",
                _is_null: "Boolean",
                _lt: "timestamptz",
                _lte: "timestamptz",
                _neq: "timestamptz",
                _nin: "timestamptz"
            },

            uuid_comparison_exp: {
                _eq: "uuid",
                _gt: "uuid",
                _gte: "uuid",
                _in: "uuid",
                _is_null: "Boolean",
                _lt: "uuid",
                _lte: "uuid",
                _neq: "uuid",
                _nin: "uuid"
            },

            Boolean_comparison_exp: {
                _eq: "Boolean",
                _gt: "Boolean",
                _gte: "Boolean",
                _in: "Boolean",
                _is_null: "Boolean",
                _lt: "Boolean",
                _lte: "Boolean",
                _neq: "Boolean",
                _nin: "Boolean"
            },

            jsonb_comparison_exp: {
                _contained_in: "jsonb",
                _contains: "jsonb",
                _eq: "jsonb",
                _gt: "jsonb",
                _gte: "jsonb",
                _has_key: "String",
                _has_keys_all: "String",
                _has_keys_any: "String",
                _in: "jsonb",
                _is_null: "Boolean",
                _lt: "jsonb",
                _lte: "jsonb",
                _neq: "jsonb",
                _nin: "jsonb"
            },

            discord_bool_exp: {
                _and: "discord_bool_exp",
                _not: "discord_bool_exp",
                _or: "discord_bool_exp",
                avatar: "String_comparison_exp",
                bot: "Boolean_comparison_exp",
                discriminator: "String_comparison_exp",
                email: "String_comparison_exp",
                id: "String_comparison_exp",
                roles: "jsonb_comparison_exp",
                system: "Boolean_comparison_exp",
                user: "user_bool_exp",
                username: "String_comparison_exp"
            },

            like_bool_exp: {
                _and: "like_bool_exp",
                _not: "like_bool_exp",
                _or: "like_bool_exp",
                created: "timestamptz_comparison_exp",
                media: "media_bool_exp",
                media_id: "uuid_comparison_exp",
                user: "user_bool_exp",
                user_id: "uuid_comparison_exp"
            },

            oauth_token_bool_exp: {
                _and: "oauth_token_bool_exp",
                _not: "oauth_token_bool_exp",
                _or: "oauth_token_bool_exp",
                access_token: "String_comparison_exp",
                expires: "timestamptz_comparison_exp",
                refresh_token: "String_comparison_exp",
                scope: "jsonb_comparison_exp",
                user_id: "uuid_comparison_exp"
            },

            user_bool_exp: {
                _and: "user_bool_exp",
                _not: "user_bool_exp",
                _or: "user_bool_exp",
                comments: "comment_bool_exp",
                discord: "discord_bool_exp",
                discord_id: "String_comparison_exp",
                id: "uuid_comparison_exp",
                likes: "like_bool_exp",
                name: "String_comparison_exp",
                token: "oauth_token_bool_exp"
            },

            comment_bool_exp: {
                _and: "comment_bool_exp",
                _not: "comment_bool_exp",
                _or: "comment_bool_exp",
                created: "timestamptz_comparison_exp",
                id: "uuid_comparison_exp",
                media: "media_bool_exp",
                media_id: "uuid_comparison_exp",
                media_timestamp: "String_comparison_exp",
                text: "String_comparison_exp",
                user: "user_bool_exp",
                user_id: "uuid_comparison_exp"
            },

            date_comparison_exp: {
                _eq: "date",
                _gt: "date",
                _gte: "date",
                _in: "date",
                _is_null: "Boolean",
                _lt: "date",
                _lte: "date",
                _neq: "date",
                _nin: "date"
            },

            Int_comparison_exp: {
                _eq: "Int",
                _gt: "Int",
                _gte: "Int",
                _in: "Int",
                _is_null: "Boolean",
                _lt: "Int",
                _lte: "Int",
                _neq: "Int",
                _nin: "Int"
            },

            tag_bool_exp: {
                _and: "tag_bool_exp",
                _not: "tag_bool_exp",
                _or: "tag_bool_exp",
                media: "media_bool_exp",
                media_id: "uuid_comparison_exp",
                name: "String_comparison_exp",
                score: "Int_comparison_exp"
            },

            media_bool_exp: {
                _and: "media_bool_exp",
                _not: "media_bool_exp",
                _or: "media_bool_exp",
                bpm: "String_comparison_exp",
                comments: "comment_bool_exp",
                data_folder: "String_comparison_exp",
                id: "uuid_comparison_exp",
                likes: "like_bool_exp",
                recorded_date: "date_comparison_exp",
                season: "String_comparison_exp",
                stereo_mix: "jsonb_comparison_exp",
                tags: "tag_bool_exp",
                title: "String_comparison_exp",
                torrent: "String_comparison_exp",
                tracks: "jsonb_comparison_exp",
                youtube_url: "String_comparison_exp"
            }
        }
    },

    policy: "NetworkOnly"
};
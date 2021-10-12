export type AllTracks = {
    readonly "input": AllTracks$input,
    readonly "result": AllTracks$result
};

export type AllTracks$result = {
    readonly media: ({
        readonly title: string,
        readonly bpm: string | null,
        readonly data_folder: string,
        readonly id: string,
        readonly recorded_date: string | null,
        readonly stereo_mix: object,
        readonly tracks: object,
        readonly likes_count: number | null,
        readonly liked: boolean | null
    })[]
};

type String_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _ilike: string | null | undefined,
    _in: (string)[] | null | undefined,
    _iregex: string | null | undefined,
    _is_null: boolean | null | undefined,
    _like: string | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nilike: string | null | undefined,
    _nin: (string)[] | null | undefined,
    _niregex: string | null | undefined,
    _nlike: string | null | undefined,
    _nregex: string | null | undefined,
    _nsimilar: string | null | undefined,
    _regex: string | null | undefined,
    _similar: string | null | undefined
};

type timestamptz_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _in: (string)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nin: (string)[] | null | undefined
};

type uuid_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _in: (string)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nin: (string)[] | null | undefined
};

type Boolean_comparison_exp = {
    _eq: boolean | null | undefined,
    _gt: boolean | null | undefined,
    _gte: boolean | null | undefined,
    _in: (boolean)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: boolean | null | undefined,
    _lte: boolean | null | undefined,
    _neq: boolean | null | undefined,
    _nin: (boolean)[] | null | undefined
};

type jsonb_comparison_exp = {
    _contained_in: object | null | undefined,
    _contains: object | null | undefined,
    _eq: object | null | undefined,
    _gt: object | null | undefined,
    _gte: object | null | undefined,
    _has_key: string | null | undefined,
    _has_keys_all: (string)[] | null | undefined,
    _has_keys_any: (string)[] | null | undefined,
    _in: (object)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: object | null | undefined,
    _lte: object | null | undefined,
    _neq: object | null | undefined,
    _nin: (object)[] | null | undefined
};

type discord_bool_exp = {
    _and: (discord_bool_exp)[] | null | undefined,
    _not: discord_bool_exp | null | undefined,
    _or: (discord_bool_exp)[] | null | undefined,
    avatar: String_comparison_exp | null | undefined,
    bot: Boolean_comparison_exp | null | undefined,
    discriminator: String_comparison_exp | null | undefined,
    email: String_comparison_exp | null | undefined,
    id: String_comparison_exp | null | undefined,
    roles: jsonb_comparison_exp | null | undefined,
    system: Boolean_comparison_exp | null | undefined,
    user: user_bool_exp | null | undefined,
    username: String_comparison_exp | null | undefined
};

type like_bool_exp = {
    _and: (like_bool_exp)[] | null | undefined,
    _not: like_bool_exp | null | undefined,
    _or: (like_bool_exp)[] | null | undefined,
    created: timestamptz_comparison_exp | null | undefined,
    media: media_bool_exp | null | undefined,
    media_id: uuid_comparison_exp | null | undefined,
    user: user_bool_exp | null | undefined,
    user_id: uuid_comparison_exp | null | undefined
};

type oauth_token_bool_exp = {
    _and: (oauth_token_bool_exp)[] | null | undefined,
    _not: oauth_token_bool_exp | null | undefined,
    _or: (oauth_token_bool_exp)[] | null | undefined,
    access_token: String_comparison_exp | null | undefined,
    expires: timestamptz_comparison_exp | null | undefined,
    refresh_token: String_comparison_exp | null | undefined,
    scope: jsonb_comparison_exp | null | undefined,
    user_id: uuid_comparison_exp | null | undefined
};

type user_bool_exp = {
    _and: (user_bool_exp)[] | null | undefined,
    _not: user_bool_exp | null | undefined,
    _or: (user_bool_exp)[] | null | undefined,
    comments: comment_bool_exp | null | undefined,
    discord: discord_bool_exp | null | undefined,
    discord_id: String_comparison_exp | null | undefined,
    id: uuid_comparison_exp | null | undefined,
    likes: like_bool_exp | null | undefined,
    name: String_comparison_exp | null | undefined,
    token: oauth_token_bool_exp | null | undefined
};

type comment_bool_exp = {
    _and: (comment_bool_exp)[] | null | undefined,
    _not: comment_bool_exp | null | undefined,
    _or: (comment_bool_exp)[] | null | undefined,
    created: timestamptz_comparison_exp | null | undefined,
    id: uuid_comparison_exp | null | undefined,
    media: media_bool_exp | null | undefined,
    media_id: uuid_comparison_exp | null | undefined,
    media_timestamp: String_comparison_exp | null | undefined,
    text: String_comparison_exp | null | undefined,
    user: user_bool_exp | null | undefined,
    user_id: uuid_comparison_exp | null | undefined
};

type date_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _in: (string)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nin: (string)[] | null | undefined
};

type Int_comparison_exp = {
    _eq: number | null | undefined,
    _gt: number | null | undefined,
    _gte: number | null | undefined,
    _in: (number)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: number | null | undefined,
    _lte: number | null | undefined,
    _neq: number | null | undefined,
    _nin: (number)[] | null | undefined
};

type tag_bool_exp = {
    _and: (tag_bool_exp)[] | null | undefined,
    _not: tag_bool_exp | null | undefined,
    _or: (tag_bool_exp)[] | null | undefined,
    media: media_bool_exp | null | undefined,
    media_id: uuid_comparison_exp | null | undefined,
    name: String_comparison_exp | null | undefined,
    score: Int_comparison_exp | null | undefined
};

type media_bool_exp = {
    _and: (media_bool_exp)[] | null | undefined,
    _not: media_bool_exp | null | undefined,
    _or: (media_bool_exp)[] | null | undefined,
    bpm: String_comparison_exp | null | undefined,
    comments: comment_bool_exp | null | undefined,
    data_folder: String_comparison_exp | null | undefined,
    id: uuid_comparison_exp | null | undefined,
    likes: like_bool_exp | null | undefined,
    recorded_date: date_comparison_exp | null | undefined,
    season: String_comparison_exp | null | undefined,
    stereo_mix: jsonb_comparison_exp | null | undefined,
    tags: tag_bool_exp | null | undefined,
    title: String_comparison_exp | null | undefined,
    torrent: String_comparison_exp | null | undefined,
    tracks: jsonb_comparison_exp | null | undefined,
    youtube_url: String_comparison_exp | null | undefined
};

export type AllTracks$input = {
    where: media_bool_exp | null | undefined
};
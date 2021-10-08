export type RemoveLike = {
    readonly "input": RemoveLike$input,
    readonly "result": RemoveLike$result
};

export type RemoveLike$result = {
    readonly delete_like: {
        readonly returning: ({
            readonly media_id: string
        })[]
    } | null
};

export type RemoveLike$input = {
    id: string
};
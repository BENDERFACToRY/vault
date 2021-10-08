export type AddLike = {
    readonly "input": AddLike$input,
    readonly "result": AddLike$result
};

export type AddLike$result = {
    readonly insert_like: {
        readonly returning: ({
            readonly media_id: string
        })[]
    } | null
};

export type AddLike$input = {
    id: string
};
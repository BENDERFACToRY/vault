export type addLike = {
    readonly "input": addLike$input,
    readonly "result": addLike$result
};

export type addLike$result = {
    readonly insert_like: {
        readonly affected_rows: number
    } | null
};

export type addLike$input = {
    id: string
};
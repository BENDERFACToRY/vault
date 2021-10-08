export type removeLike = {
    readonly "input": removeLike$input,
    readonly "result": removeLike$result
};

export type removeLike$result = {
    readonly delete_like: {
        readonly affected_rows: number
    } | null
};

export type removeLike$input = {
    id: string
};
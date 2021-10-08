export type MyLikes = {
    readonly "input": MyLikes$input,
    readonly "result": MyLikes$result
};

export type MyLikes$result = {
    readonly like: ({
        readonly media_id: string
    })[]
};

export type MyLikes$input = {
    userId: string
};
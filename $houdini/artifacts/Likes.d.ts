export type Likes = {
    readonly "shape"?: Likes$data,
    readonly "$fragments": {
        "Likes": true
    }
};

export type Likes$data = {
    readonly likes: ({
        readonly media_id: string
    })[]
};
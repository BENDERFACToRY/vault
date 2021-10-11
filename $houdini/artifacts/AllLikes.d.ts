export type AllLikes = {
    readonly "shape"?: AllLikes$data,
    readonly "$fragments": {
        "AllLikes": true
    }
};

export type AllLikes$data = {
    readonly likes: ({
        readonly media_id: string
    })[]
};
export type AllTracks = {
    readonly "input": null,
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
        readonly likes_aggregate: {
            readonly aggregate: {
                readonly count: number
            } | null
        }
    })[]
};
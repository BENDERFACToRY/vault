export type GetTrack = {
    readonly "input": GetTrack$input,
    readonly "result": GetTrack$result
};

export type GetTrack$result = {
    readonly media: ({
        readonly title: string,
        readonly bpm: string | null,
        readonly data_folder: string,
        readonly id: string,
        readonly recorded_date: string | null,
        readonly stereo_mix: object,
        readonly tracks: object,
        readonly youtube_url: string | null,
        readonly torrent: string | null
    })[]
};

export type GetTrack$input = {
    data_folder: string
};
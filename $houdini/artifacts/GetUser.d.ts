export type GetUser = {
    readonly "input": null,
    readonly "result": GetUser$result
};

export type GetUser$result = {
    readonly user: ({
        readonly id: string,
        readonly name: string,
        readonly comments: ({
            readonly media: {
                readonly id: string
            },
            readonly text: string
        })[],
        readonly likes: ({
            readonly media_id: string,
            readonly media: {
                readonly title: string
            }
        })[],
        readonly discord: {
            readonly username: string,
            readonly avatar: string | null,
            readonly bot: boolean,
            readonly discriminator: string | null,
            readonly email: string | null,
            readonly system: boolean,
            readonly roles: object
        } | null
    })[]
};
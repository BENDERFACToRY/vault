export default {
    name: "GetUser",
    kind: "HoudiniQuery",
    hash: "661b3648ced08dfecb90e156de0ae8d1c2e7c25e2a70ed036fc50c2f459bef58",

    raw: `query GetUser {
  user {
    id
    name
    comments {
      media {
        id
      }
      text
      id
    }
    likes {
      media_id
      media {
        title
        id
      }
    }
    discord {
      username
      avatar
      bot
      discriminator
      email
      system
      roles
      id
    }
  }
}
`,

    rootType: "query_root",

    selection: {
        user: {
            type: "user",
            keyRaw: "user",

            fields: {
                id: {
                    type: "uuid",
                    keyRaw: "id"
                },

                name: {
                    type: "String",
                    keyRaw: "name"
                },

                comments: {
                    type: "comment",
                    keyRaw: "comments",

                    fields: {
                        media: {
                            type: "media",
                            keyRaw: "media",

                            fields: {
                                id: {
                                    type: "uuid",
                                    keyRaw: "id"
                                }
                            }
                        },

                        text: {
                            type: "String",
                            keyRaw: "text"
                        },

                        id: {
                            type: "uuid",
                            keyRaw: "id"
                        }
                    }
                },

                likes: {
                    type: "like",
                    keyRaw: "likes",

                    fields: {
                        media_id: {
                            type: "uuid",
                            keyRaw: "media_id"
                        },

                        media: {
                            type: "media",
                            keyRaw: "media",

                            fields: {
                                title: {
                                    type: "String",
                                    keyRaw: "title"
                                },

                                id: {
                                    type: "uuid",
                                    keyRaw: "id"
                                }
                            }
                        }
                    }
                },

                discord: {
                    type: "discord",
                    keyRaw: "discord",

                    fields: {
                        username: {
                            type: "String",
                            keyRaw: "username"
                        },

                        avatar: {
                            type: "String",
                            keyRaw: "avatar"
                        },

                        bot: {
                            type: "Boolean",
                            keyRaw: "bot"
                        },

                        discriminator: {
                            type: "String",
                            keyRaw: "discriminator"
                        },

                        email: {
                            type: "String",
                            keyRaw: "email"
                        },

                        system: {
                            type: "Boolean",
                            keyRaw: "system"
                        },

                        roles: {
                            type: "jsonb",
                            keyRaw: "roles"
                        },

                        id: {
                            type: "String",
                            keyRaw: "id"
                        }
                    }
                }
            }
        }
    },

    policy: "NetworkOnly"
};
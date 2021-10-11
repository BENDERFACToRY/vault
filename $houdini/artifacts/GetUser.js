export default {
    name: "GetUser",
    kind: "HoudiniQuery",
    hash: "5ada799b1025e5293a88ebe728a65174f8a60a5ff7b0465737a1ff13df18c0d6",

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
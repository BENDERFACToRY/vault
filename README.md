# BENDERFACToRY vault

- Powered by [svelte-kit](https://kit.svelte.dev/) and [IPFS](https://ipfs.io)
- Queries the vault on IPFS for all the data
- Renders a nice shiny UI
- Publishes the shiny UI on IPFS

## Running locally for development

- Setup docker
- Install [docker hostmanager](https://github.com/iamluc/docker-hostmanager) is recommended. It populates the hostsfile with all docker containers.
- Install the API
- Install [nodejs](https://nodejs.org/en/download/)

- Checkout the codebase
- Install the dependencies `npm install`
- Run the devserver `npm run dev`
- Open http://localhost:3000 in the browser

## API

Install and run the API locally https://github.com/BENDERFACToRY/api

## Houdini

[Houdini](https://github.com/AlecAivazis/houdini) is being used as the graphql client.
Whenever a query is changed/added it's required to run `npm run houdini` which will connect to your local graphql api, and generate the type definitions for use in the frontend.

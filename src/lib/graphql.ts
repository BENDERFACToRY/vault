import { writable } from 'svelte/store';
import { gql, GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '$lib/config';

export { gql };

export function getClient() {
	const client = new GraphQLClient(GRAPHQL_ENDPOINT);
	const token = writable<string>();

	token.subscribe((token) => {
		client.setHeaders(
			token
				? {
						authorization: `Bearer ${token}`
				  }
				: {}
		);
	});
	return {
		client,
		token
	};
}

export const { client, token } = getClient();

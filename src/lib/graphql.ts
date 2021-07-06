import { writable } from 'svelte/store';
import { gql, GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '$lib/config';

console.log('Endpoint', GRAPHQL_ENDPOINT);

export { gql };
export const token = writable(null);
export const client = new GraphQLClient(GRAPHQL_ENDPOINT);

token.subscribe((token) => {
	if (token) {
		client.setHeaders({
			authorization: `Bearer ${token}`
		});
	}
});

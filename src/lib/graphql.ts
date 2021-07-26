import { writable, readable } from 'svelte/store';

import { browser } from '$app/env';

import { gql, GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { GRAPHQL_ENDPOINT, GRAPHQL_WS_ENDPOINT } from '$lib/config';

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

export const getSubscriptionClient = (token) => {
	const client =
		browser &&
		createClient({
			url: GRAPHQL_WS_ENDPOINT,

			connectionParams: () => {
				console.log('Getting connparams', token);
				return {
					headers: {
						Authorization: `Bearer ${token}`
					}
				};
			}
		});

	const subscribe = (query) =>
		readable(null, (set) => {
			if (!browser) return;

			client.subscribe(
				{
					query
				},
				{
					next: (data) => set(data),
					error: (err) => console.error('error in subscription', err),
					complete: () => console.log('Subscription ready')
				}
			);
		});

	return {
		client,
		subscribe
	};
};

export const { client, token } = getClient();

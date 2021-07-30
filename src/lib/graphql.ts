import { get, writable, readable } from 'svelte/store';
import { browser } from '$app/env';
// import fetch from 'cross-fetch'
import { GRAPHQL_ENDPOINT, GRAPHQL_WS_ENDPOINT } from '$lib/config';

import {
	gql,
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	HttpLink,
	concat
} from '@apollo/client/core';

export function createClient(authToken = '') {
	const token = writable<string>(authToken);

	const authMiddleware = new ApolloLink((operation, forward) => {
		const _token = get(token);
		if (_token) {
			operation.setContext({
				headers: {
					authorization: `Bearer ${_token}`
				}
			});
		}
		return forward(operation);
	});

	const httpLink = new HttpLink({
		uri: GRAPHQL_ENDPOINT,
		fetch
	});
	const cache = new InMemoryCache();
	const client = new ApolloClient({
		link: concat(authMiddleware, httpLink),
		cache
	});
	return { client, token };
}
export { gql };

// export const getSubscriptionClient = (token) => {
// 	const client =
// 		browser &&
// 		createClient({
// 			url: GRAPHQL_WS_ENDPOINT,

// 			connectionParams: () => {
// 				console.log('Getting connparams', token);
// 				return {
// 					headers: {
// 						Authorization: `Bearer ${token}`
// 					}
// 				};
// 			}
// 		});

// 	const subscribe = (query) =>
// 		readable(null, (set) => {
// 			if (!browser) return;

// 			client.subscribe(
// 				{
// 					query
// 				},
// 				{
// 					next: (data) => set(data),
// 					error: (err) => console.error('error in subscription', err),
// 					complete: () => console.log('Subscription ready')
// 				}
// 			);
// 		});

// 	return {
// 		client,
// 		subscribe
// 	};
// };

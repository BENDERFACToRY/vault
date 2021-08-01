import { get, writable } from 'svelte/store';
// import fetch from 'cross-fetch'
import { GRAPHQL_ENDPOINT, GRAPHQL_WS_ENDPOINT } from '$lib/config';

import pkg from '@apollo/client/core/core.cjs.js';
const { ApolloLink, HttpLink, InMemoryCache, ApolloClient, concat } = pkg;

export const client = writable();
export const token = writable();

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

export function setupClient() {
	const { client: _client, token: _token } = createClient();
	token.set(_token);
	client.set(_client);
}

export function query(query, options) {
	const c = get(client);
}

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

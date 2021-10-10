import { GRAPHQL_ENDPOINT } from '$lib/config';

export const query = async ({ query, variables, token }) => {
	const resp = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify({
			query,
			variables
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return await resp.json();
};

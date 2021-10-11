import { GRAPHQL_ENDPOINT } from '$lib/config';

export const query = async ({ query, variables, token }) => {
	console.log('Q:', query);
	console.log('V:', JSON.stringify(variables));
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

	const body = await resp.json();
	const { data, errors } = body;

	console.log('Res:', body);
	if (errors) {
		throw new Error(errors);
	}
	return data;
};

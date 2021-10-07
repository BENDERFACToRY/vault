export const query = async ({ query, variables, token }) => {
	const resp = await fetch(`http://graphql.benders/v1/graphql`, {
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

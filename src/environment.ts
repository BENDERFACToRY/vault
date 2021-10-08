import { Environment } from '$houdini';

export default new Environment(async function ({ text, variables = {} }, session) {
	const headers = {};
	if ('token' in session) {
		headers.Authorization = `Bearer ${session.token}`;
	}

	// send the request to the api
	const result = await this.fetch('http://graphql.benders/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...headers
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	// parse the result as json
	return await result.json();
});

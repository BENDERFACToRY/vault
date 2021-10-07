import { Environment } from '$houdini';

export default new Environment(async function ({ text, variables = {} }, session) {
	console.log('Got session', session);
	// send the request to the api
	const result = await this.fetch('http://graphql.benders/v1/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.token}`
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	// parse the result as json
	return await result.json();
});

/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: 'schema.gql',
	sourceGlob: 'src/**/*.svelte',
	module: 'esm',
	framework: 'kit',
	apiUrl: 'http://graphql.benders/v1/graphql',

	scalars: {
		uuid: {
			type: 'string',
			unmarshal(val) {
				return val;
			},
			marshal(val) {
				return val;
			}
		},
		date: {
			type: 'string',
			unmarshal(val) {
				return val;
			},
			marshal(val) {
				return val;
			}
		},
		jsonb: {
			type: 'object',
			unmarshal(val) {
				return val;
			},
			marshal(val) {
				return val;
			}
		}
	}
};

export default config;

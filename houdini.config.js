/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: '.gql',
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
			type: 'string',
			unmarshal(val) {
				console.log('jsonb:unmarshal', val);
				return val;
			},
			marshal(val) {
				console.log('jsonb:marshal', val);
				return val;
			}
		}
	}
};

export default config;

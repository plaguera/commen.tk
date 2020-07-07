import fs from 'fs';

const env = {
	cwd: process.cwd(),
	development: process.env.NODE_ENV?.toLowerCase() === 'development',
	production: process.env.NODE_ENV?.toLowerCase() === 'production',
	test: process.env.NODE_ENV?.toLowerCase() === 'test',
	node_env: process.env.NODE_ENV,
	oauth: {
		client_id: process.env[`${process.env.NODE_ENV}_CLIENT_ID`],
		client_secret: process.env[`${process.env.NODE_ENV}_CLIENT_SECRET`],
		url_authorize: 'https://github.com/login/oauth/authorize',
		url_access_token: 'https://github.com/login/oauth/access_token',
	},
	github_app: {
		identifier: parseInt(process.env.GITHUB_APP_IDENTIFIER || ''),
		private_key: (process.env.GITHUB_APP_PRIVATE_KEY || '').replace(/\\n/gm, '\n') || fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH || '').toString()
	},
	page_size: {
		min: 1,
		max: 100,
		default: 10
	},
	cookie_secret: process.env.COOKIE_SECRET,
	github_testing_token: process.env.TESTING_GITHUB_TOKEN,
	port: process.env.PORT || '8000',
	url_api: 'https://api.github.com/',
	url_graphql: 'https://api.github.com/graphql'
};

export default env;
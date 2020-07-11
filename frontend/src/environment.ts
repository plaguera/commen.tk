import { ScriptAttributes } from "./util";

const env = {
	attributes: ScriptAttributes.toJSON(document.currentScript),
	cwd: process.cwd(),
	development: process.env.NODE_ENV?.toLowerCase() === 'development',
	production: process.env.NODE_ENV?.toLowerCase() === 'production',
	node_env: process.env.NODE_ENV,
	url_api: api(),
	url_cdn: cdn()
};

function api() {
	switch (process.env.NODE_ENV) {
		case 'development': return 'https://api.commen.tk/';
		case 'production': return 'https://api.commen.tk/';
		case 'test': return 'http://localhost:80/';
	}
}

function cdn() {
	switch (process.env.NODE_ENV) {
		case 'development': return 'http://localhost:8080/';
		case 'production': return 'https://cdn.commen.tk/';
		case 'test': return 'http://localhost:80/';
	}
}

export default env;
import fetch, { Response } from 'node-fetch';
import { Controller } from './controllers/controller';

const BASE_API_URL = 'https://api.github.com/';

export async function get(path: string) {
	const options = {
		method: 'GET'
	};

	let res = await fetch(BASE_API_URL + path, options);
	if (res.headers.get('content-type')?.includes('application/json')) {
		let json = await res.json();
		console.log(json);
		return json;
	}
}

export async function post(path: string, data?: object) {
	const options = {
		headers: {
			Accept: 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	};

	let url = path.includes('https://') ? path : BASE_API_URL + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json')) {
		let json = await res.json();
		//console.log(json);
		return json;
	}
	return res;
}

export async function query(data: string, token: string) {
	const options = {
		headers: {
			authorization: 'token ' + token //|| process.env.GITHUB_TOKEN
		},
		method: 'POST',
		body: JSON.stringify({
			query: data
		})
	};

	let res = await fetch('https://api.github.com/graphql', options);
	let json = await res.json();
	return {
		url: res.url,
		status: res.status,
		statusText: res.statusText,
		data: json
	};
}

function printHeader(res: Response) {
	const params = [
		'status',
		'server',
		'date',
		'content-type',
		'connection',
		'status',
		'etag',
		'x-github-media-type',
		'x-ratelimit-limit',
		'x-ratelimit-remaining',
		'x-ratelimit-reset',
		'content-length',
		'cache-control',
		'x-content-type-options'
	];
	let tmp = `URL - ${res.url}\n`;
	for (let param of params) tmp += `\t${param}: ${res.headers.get(param)}\n`;
	console.log(tmp);
}

import fetch from 'node-fetch';
import { Response } from 'node-fetch';

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

export async function graphql(data: string) {
	const options = {
		headers: {
			authorization: 'token ' + process.env.GITHUB_TOKEN
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
  }
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

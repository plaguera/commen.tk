import fetch from 'node-fetch';
import { ServerResponse } from './server-response';

const BASE_API_URL = 'https://api.github.com/';

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
	if (res.headers.get('content-type')?.includes('application/json')) return await res.json();
	return res;
}

export async function httpRequest(url: string, options: object) {
	let res = await fetch(url, options)//.catch(console.error);
	let json = await res.json();
	return new ServerResponse(res, json);
}

export async function query(data: string, token: string) {
	const options = {
		headers: {
			authorization: 'token ' + token
		},
		method: 'POST',
		body: JSON.stringify({
			query: data
		})
	};

	let res = await fetch('https://api.github.com/graphql', options).catch(console.error);
	let json = undefined;
	if (res && res.headers.get('content-type')?.includes('application/json')) json = await res.json();
	return new ServerResponse(res, json);
}
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
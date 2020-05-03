import fetch from 'node-fetch';

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
	let res = await fetch('https://api.github.com/graphql', options);
	let json = await res.json();
	return {
		url: res.url,
		status: res.status,
		statusText: res.statusText,
		data: json.data
	};
}
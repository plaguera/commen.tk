import { PageAttributes } from './page-attributes';

export async function get(path: string) {
	const options: RequestInit = {
		credentials: 'include',
		method: 'GET',
	};
	let res = await fetch(PageAttributes.base_url + 'api/' + path, options);

	if (res && res.headers.get('content-type')?.includes('application/json'))
		return await res.json();
	return res;
}

export async function post(path: string, data?: object) {
	const options: RequestInit = {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	};

	let url = path.includes('https://') ? path : PageAttributes.base_url + 'api/' + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json'))
		return await res.json();
	return res;
}

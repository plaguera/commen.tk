const BASE_URL_DEV = 'http://localhost:8000/';
const BASE_URL_PROD = 'https://api-github-comments.herokuapp.com/';
export const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;
export const API_URL = BASE_URL + 'api/';
export const AUTH_URL = BASE_URL + 'authorize/';

export async function get(path: string) {
	const options: RequestInit = {
		credentials: 'include',
		method: 'GET',
	};
	let res = await fetch(API_URL + path, options);

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

	let url = path.includes('https://') ? path : API_URL + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json'))
		return await res.json();
	return res;
}

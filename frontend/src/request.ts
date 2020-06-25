export const URL_CDN = process.env.NODE_ENV != 'development' ? 'https://cdn.commen.tk/' : 'http://localhost:8080/';
export const URL_API = process.env.NODE_ENV != 'development' ? 'https://api.commen.tk/' : 'http://localhost:80/';

export async function get(path: string) {
	const options: RequestInit = {
		credentials: 'include',
		method: 'GET',
	};
	let res = await fetch(URL_API + path, options);

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

	let url = path.includes('https://') ? path : URL_API + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json'))
		return await res.json();
	return res;
}

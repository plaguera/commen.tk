import env from "./environment";

export async function get(path: string) {
	const options: RequestInit = {
		credentials: 'include',
		method: 'GET',
	};
	let res = await fetch(env.url_api + path, options);

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

	let url = path.includes('https://') ? path : env.url_api + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json'))
		return await res.json();
	return res;
}
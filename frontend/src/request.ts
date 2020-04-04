const BASE_URL_DEV = 'http://localhost:8000/';
const BASE_URL_PROD = 'https://api-github-comments.herokuapp.com/';
export const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;
export const API_URL = BASE_URL + 'api/';

function getCookie(name: string) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : '';
}

export async function get(path: string) {    
	console.log(getCookie('token'))
	console.log(document.cookie)
    const options: RequestInit = {
        method: 'GET',
		credentials: 'include'
	};
	let res = await fetch(API_URL + path, options);
	
	if (res.headers.get('content-type')?.includes('application/json')) {
		let json = await res.json();
		//console.log(json);
		return json;
    }
    return res;
}

export async function post(path: string, data?: object) {
	const options = {
		headers: {
			Accept: 'application/json',
			Authorization: getCookie('token'),
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	};

	let url = path.includes('https://') ? path : API_URL + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json')) {
		let json = await res.json();
		//console.log(json);
		return json;
	}
	return res;
}
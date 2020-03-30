const BASE_API_URL = 'http://localhost:8000/api/';

function getCookie(name: string) {
    var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
    var sMatch = (' ' + document.cookie).match(re);
    if (name && sMatch) return unescape(sMatch[1]);
    return '';
}

export async function get(path: string) {    
    const options: RequestInit = {
        method: 'GET',
        headers: {
			Authorization: getCookie('token')
		}
	};
    let res = await fetch(BASE_API_URL + path, options);

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

	let url = path.includes('https://') ? path : BASE_API_URL + path;
	let res = await fetch(url, options);
	if (res.headers.get('content-type')?.includes('application/json')) {
		let json = await res.json();
		//console.log(json);
		return json;
	}
	return res;
}
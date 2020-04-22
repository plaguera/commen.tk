export function parse(script: HTMLScriptElement | SVGScriptElement | null) {
	let result = {
		user: 'plaguera',
		repo: 'tfm-testing',
		number: 1,
		theme: 'light',
		pageSize: 10,
	};
	if (script) {
		if (script instanceof HTMLScriptElement)
		PageAttributes.base_url = urlHost(script.src);
		console.log(PageAttributes.base_url)
		let tokens = script.getAttribute('repo')?.valueOf().split('/');
		let theme = script.getAttribute('theme')?.valueOf() || '';
		let pageSize = script.getAttribute('page-size')?.valueOf() || '';
		if (tokens) {
			result.user = tokens[0];
			result.repo = tokens[1];
			result.number = parseInt(tokens[2]);
		}
		if (theme) result.theme = theme;
		if (pageSize) result.pageSize = parseInt(pageSize);
	}
	return result;
}

function urlHost(url: string) {
	var arr = url.split('/');
	return arr[0] + '//' + arr[2] + '/';
}

export class PageAttributes {
	static base_url: string = 'http://localhost:9000/';
}
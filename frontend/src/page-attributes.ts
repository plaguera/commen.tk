export function parse(script: HTMLScriptElement | SVGScriptElement | null) {
	let result = {
		user: 'plaguera',
		repo: 'tfm-testing',
		number: 1,
		theme: 'light',
		pageSize: 10,
	};
	if (script) {
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
		//script.removeAttribute('repo');
		//script.removeAttribute('theme');
	}
	return result;
}

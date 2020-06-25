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
			if (tokens.length > 2)
				result.number = parseInt(tokens[2]);
			else
				result.number = -1;
		}
		if (theme) result.theme = theme;
		if (pageSize) result.pageSize = parseInt(pageSize);
	}
	return result;
}

//export const attrs = parse();
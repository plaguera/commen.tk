export function parse(script: HTMLScriptElement | SVGScriptElement | null) {
	let result = {
		owner: '',
		repo: '',
		issuename: '',
		issuenumber: -1,
		theme: 'light',
		pageSize: 10,
	};
	if (script) {
		let tokens = script.getAttribute('repo')?.valueOf().split('/');
		let name = script.getAttribute('issue-name')?.valueOf() || '';
		let number = script.getAttribute('issue-number')?.valueOf() || '';
		let theme = script.getAttribute('theme')?.valueOf() || '';
		let pageSize = script.getAttribute('page-size')?.valueOf() || '';
		
		if (tokens) {
			result.owner = tokens[0];
			result.repo = tokens[1];
		}
		if (name) result.issuename = name;
		if (number) result.issuenumber = parseInt(number);
		if (theme) result.theme = theme;
		if (pageSize) result.pageSize = parseInt(pageSize);
	}
	return result;
}

//export const attrs = parse();
export function parse(script: HTMLScriptElement | SVGScriptElement | null) {
    let result = {
        user: 'plaguera',
        repo: 'tfm-testing',
        number: 1,
        theme: 'light'
    };
    if (script) {
        let tokens = script.getAttribute('repo')?.valueOf().split('/');
        let theme = script.getAttribute('theme')?.valueOf() || '';
        if (tokens) {
            result.user = tokens[0];
            result.repo = tokens[1];
            result.number = parseInt(tokens[2]);
        }
        if (theme)
            result.theme = theme;
        //script.removeAttribute('repo');
        //script.removeAttribute('theme');
    }
    return result;
}
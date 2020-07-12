import env from './environment';
import { WidgetProps, Attributes } from './props';
import agent from './agent';

export function loadTheme(theme: string) {
	return new Promise(resolve => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.setAttribute('crossorigin', 'anonymous');
		link.onload = resolve;
		link.href = `${env.url_cdn}themes/${theme}.css`;
		document.head.appendChild(link);
	});
}

export function replaceScript(script: HTMLScriptElement | SVGScriptElement | null, tmp: HTMLDivElement) {
    if (script && script.parentElement) {
        tmp.className = 'commen-tk';
        script.parentElement.replaceChild(tmp, script);
    }
}

export function lowerCaseExceptFirst(str: string) {
    return str
        .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
        .replace(/^[^ ]/g, match => (match.toUpperCase()));
}

export class ScriptAttributes {

    private static themes = ['light', 'dark'];
    private static script: HTMLScriptElement | SVGScriptElement;

    static toJSON(script: HTMLScriptElement | SVGScriptElement | null): Attributes {
        if (!script) throw 'Script tag not found';
        ScriptAttributes.script = script;
        let json: Attributes = {
            repo: ScriptAttributes.repo(),
            issue: {
                name: ScriptAttributes.issueName(),
                number: ScriptAttributes.issueNumber()
            },
            theme: ScriptAttributes.theme(),
            pageSize: ScriptAttributes.pageSize()
        }
        return json;
    }

    private static repo() {
        let attr = ScriptAttributes.script.getAttribute('repo');
        if (attr && attr.valueOf().match('\\w+\\/\\w+'))
            return attr.valueOf();
        throw 'No valid [Repo] attribute present in script tag';
    }

    private static issueName() {
        let name = ScriptAttributes.script.getAttribute('issue-name');
        let number = ScriptAttributes.script.getAttribute('issue-number');
        if (name && !number)
            return name.valueOf();
        if (!name && !number)
            throw 'No [issue-name] or [issue-number] attributes present in script tag';
        return '';
    }

    private static issueNumber() {
        let number = ScriptAttributes.script.getAttribute('issue-number');
        if (number) {
            let issue = parseInt(number.valueOf());
            if (issue < 1)
                throw 'No valid [issue-number] attribute present in script tag';
            return issue;
        }
        return -1;
    }

    private static theme() {
        let attr = ScriptAttributes.script.getAttribute('theme');
        if (attr) {
            let theme = attr.valueOf();
            if (this.themes.includes(theme))
                return theme;
            throw `${theme} theme not found`;
        }
        return 'light';
    }

    private static pageSize() {
        let attr = ScriptAttributes.script.getAttribute('page-size');
        if (attr) {
            let pagesize = parseInt(attr.valueOf());
            if (pagesize < 1 || pagesize > 100)
                throw 'Page size must stay between 1 and 100';
            return pagesize;
        }
        return 10;
    }

}
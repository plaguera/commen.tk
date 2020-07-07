import env from './environment';
import { WidgetProps } from './props';

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

export class ScriptAttributes {

    script: HTMLScriptElement | SVGScriptElement;

    themes = ['light', 'dark'];

    constructor(script: HTMLScriptElement | SVGScriptElement) {
        this.script = script;
    }

    toJSON(): WidgetProps {
        let json: WidgetProps = {
            owner: this.owner(),
            repo: this.repo(),
            issueName: this.issueName(),
            issueNumber: this.issueNumber(),
            theme: this.theme(),
            pageSize: this.pageSize()
        }
        return json;
    }

    private owner() {
        let attr = this.script.getAttribute('repo');
        if (attr)
            return attr.valueOf().split('/')[0];
        throw 'No [Owner] attribute present in script tag';
    }

    private repo() {
        let attr = this.script.getAttribute('repo');
        if (attr)
            return attr.valueOf().split('/')[1];
        throw 'No [Repo] attribute present in script tag';
    }

    private issueName() {
        let name = this.script.getAttribute('issue-name');
        let number = this.script.getAttribute('issue-number');
        if (name && !number)
            return name.valueOf();
        return '';
    }

    private issueNumber() {
        let number = this.script.getAttribute('issue-number');
        if (number) {
            let issue = parseInt(number.valueOf());
            if (issue < 1)
                throw 'No [Owner] attribute present in script tag';
            return issue;
        }
        return -1;
    }

    private theme() {
        let attr = this.script.getAttribute('theme');
        if (attr) {
            let theme = attr.valueOf();
            if (this.themes.includes(theme))
                return theme;
            throw `${theme} theme not found`;
        }
        return 'light';
    }

    private pageSize() {
        let attr = this.script.getAttribute('page-size');
        if (attr) {
            let pagesize = parseInt(attr.valueOf());
            if (pagesize < 1 || pagesize > 100)
                throw 'Page size must stay between 1 and 100';
            return pagesize;
        }
        return 10;
    }

}
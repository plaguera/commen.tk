import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import * as serviceWorker from './serviceWorker';
import { PageAttributes, parse } from './page-attributes';

export function loadTheme(theme: string) {
	return new Promise(resolve => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.setAttribute('crossorigin', 'anonymous');
		link.onload = resolve;
		link.href = `${PageAttributes.base_url}themes/${theme}.css`;
		document.head.appendChild(link);
	});
}

console.log(process.env.NODE_ENV);
let script = document.currentScript;
if (script && script.parentElement) {
	var tmp = document.createElement('div');
	tmp.className = 'commen-tk';
	let attrs = parse(script);
	loadTheme(attrs.theme).then(() => {
		ReactDOM.render(<Widget {...attrs} />, tmp);
		if (script && script.parentElement) script.parentElement.replaceChild(tmp, script);
	});
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

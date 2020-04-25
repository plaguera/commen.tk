import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import * as serviceWorker from './serviceWorker';
import * as attributes from './page-attributes';

function addCss(theme: string) {
	var head = document.head;
	var link = document.createElement("link");

	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = attributes.PageAttributes.base_url + 'themes/' + theme + '.css';

	head.appendChild(link);
}

console.log(process.env.NODE_ENV);
let script = document.currentScript;
if (script && script.parentElement) {
	var tmp = document.createElement('div');
	tmp.className = 'github-comments';
	let attrs = attributes.parse(script);
	addCss(attrs.theme);
	ReactDOM.render(<Widget {...attrs} />, tmp);
	script.parentElement.replaceChild(tmp, script);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

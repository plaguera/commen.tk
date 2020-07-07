import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import * as serviceWorker from './serviceWorker';
import { loadTheme, ScriptAttributes } from './util';
import env from './environment';

try {
	console.log(env.node_env);
	let script = document.currentScript;
	if (script && script.parentElement) {
		var tmp = document.createElement('div');
		tmp.className = 'commen-tk';
		let attrs = new ScriptAttributes(script).toJSON();
		loadTheme(attrs.theme).then(() => {
			ReactDOM.render(<Widget {...attrs} />, tmp);
			if (script && script.parentElement) script.parentElement.replaceChild(tmp, script);
		});
	}
} catch(e) {
	console.error(e);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

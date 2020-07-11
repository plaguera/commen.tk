import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './components/Widget';
import { loadTheme, replaceScript } from './util';
import env from './environment';

try {
	let script = document.currentScript;
	let tmp = document.createElement('div');
	loadTheme(env.attributes.theme).then(() => {
		ReactDOM.render(<Widget {...env.attributes} />, tmp);
		replaceScript(script, tmp);
	});
} catch (e) {
	console.error(e);
}

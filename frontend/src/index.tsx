import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import * as serviceWorker from './serviceWorker';
import Util from './util';
import * as attributes from './page-attributes';

console.log(process.env.NODE_ENV);
let script = document.currentScript;
Util.loadUser().then(() => {
	ReactDOM.render(
		<React.StrictMode>
			<Widget {...attributes.parse(script)} />
		</React.StrictMode>,
		document.getElementById('root')
	);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

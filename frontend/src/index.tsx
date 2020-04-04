import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { loadUser, parseScriptAttributes, loggedIn } from './util';

console.log(process.env.NODE_ENV);
loadUser().then(() => {
	console.log(loggedIn());
	ReactDOM.render(
		<React.StrictMode>
			<App {...parseScriptAttributes()} />
		</React.StrictMode>,
		document.getElementById('root')
	);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

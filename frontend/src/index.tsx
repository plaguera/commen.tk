import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let data = {
  user: "plaguera",
  repo: "tfm-testing",
  number: 1
}
let script = document.currentScript;
if (script) {
  let tokens = script.getAttribute('repo')?.valueOf().split('/');
  if (tokens) {
    data = {
      user: tokens[0],
      repo: tokens[1],
      number: parseInt(tokens[2])
    }
  }
  script.removeAttribute('repo');
}
console.log(process.env.NODE_ENV);
console.log(document.cookie);
ReactDOM.render(
  <React.StrictMode>
    <App {...data} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

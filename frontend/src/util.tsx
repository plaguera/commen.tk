import * as request from './request';
import { UserProps } from './props';

var user: UserProps | undefined;
const default_issue = {
	user: "plaguera",
	repo: "tfm-testing",
	number: 1
}

export async function loadUser() {
    request.get('user')
        .then(result => user = result.data.viewer)
        .catch(error => user = undefined);
}

export function loggedIn() {
    console.log(user);
    return user !== undefined;
}

export function parseScriptAttributes() {
    let result = default_issue;
    let script = document.currentScript;
    if (script) {
        let tokens = script.getAttribute('repo')?.valueOf().split('/');
        if (tokens) {
            result = {
                user: tokens[0],
                repo: tokens[1],
                number: parseInt(tokens[2])
            }
        }
        script.removeAttribute('repo');
    }
    return result;
}
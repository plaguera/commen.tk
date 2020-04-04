import * as request from './request';
import { UserProps } from './props';

const default_issue = {
    user: "plaguera",
    repo: "tfm-testing",
    number: 1
}

class Util {
    static user: UserProps | undefined;
    
    static async loadUser() {
        request.get('user')
            .then(result => Util.user = result.data.viewer)
            .catch(error => Util.user = undefined);
    }
    
    static loggedIn() {
        console.log(Util.user);
        return Util.user !== undefined;
    }
    
    static parseScriptAttributes() {
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

}

export default Util;

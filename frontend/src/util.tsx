import * as request from './request';
import { UserProps } from './props';

/*const default_issue = {
    user: 'ULL-ESIT-GRADOII-TFG',
    repo: 'tfm-pedro-laguera-software',
    number: 1
}*/

const default_issue = {
    user: 'plaguera',
    repo: 'tfm-testing',
    number: 1
}

class Util {
    private static user: UserProps;
    
    static async loadUser() {
        let res = await request.get('user').catch(console.error);
        if (res.data) Util.user = res.data.viewer;
    }
    
    static loggedIn() {
        return Util.user !== undefined;
    }
    
    static parseScriptAttributes() {
        let result = default_issue;
        let script = document.currentScript;
        console.log(script);
        if (script) {
            let tokens = script.getAttribute('repo')?.valueOf().split('/');
            console.log(tokens);
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

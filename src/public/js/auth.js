import { Cookie } from './cookie';
import { Util } from './util';

export class Auth {
    static init() {
        Auth.token = {};
        var targetProxy = new Proxy(Auth.token, {
            set: function(target, key, value) {
                console.log(`${key} set to ${value}`);
                target[key] = value;
                return true;
            }
        });
        const params = Util.deparamUrl();
        let cookie = Cookie.getTokenCookie();
        if (cookie && params) {
            Cookie.setTokenCookie(params);
            Auth.token = params;
            console.log('YES COOKIE YES PARAMS');
        } else if (!cookie && !params) {
            console.log('NO COOKIE NO PARAMS');
        } else if (!cookie && params) {
            Cookie.setTokenCookie(params);
            Auth.token = params;
            console.log('NO COOKIE YES PARAMS');
        } else if (cookie && !params) {
            Auth.token = cookie;
            console.log('YES COOKIE NO PARAMS');
        }
        //console.log(`${JSON.stringify(Auth.token)}`);
    }

    static signedIn() {
        return Auth.token;
    }
}
import { Cookie } from './cookie';
import { Util } from './util';

export class Auth {
    static init() {
        const params = Util.deparamUrl();
        let cookie = Cookie.getTokenCookie();
        if (cookie && params) {
            Cookie.setTokenCookie(params);
            console.log('YES COOKIE YES PARAMS');
        } else if (!cookie && !params) {
            console.log('NO COOKIE NO PARAMS');
        } else if (!cookie && params) {
            Cookie.setTokenCookie(params);
            console.log('NO COOKIE YES PARAMS');
        } else if (cookie && !params) {
            console.log('YES COOKIE NO PARAMS');
        }
        //console.log(`${JSON.stringify(Auth.token)}`);
    }

    static signedIn() {
        return Cookie.getTokenCookie();
    }
}
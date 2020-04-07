import * as request from './request';
import { UserProps } from './props';

class Util {
    private static user: UserProps;
    
    static async loadUser() {
        let res = await request.get('user').catch(console.error);
        if (res.data) Util.user = res.data.viewer;
    }
    
    static loggedIn() {
        return Util.user !== undefined;
    }
}

export default Util;

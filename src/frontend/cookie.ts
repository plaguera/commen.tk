export class Cookie {
    static set(name: string, value: object, exhours: number) {
        var d = new Date();
        d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    static get(name: string) {
        var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
        var sMatch = (' ' + document.cookie).match(re);
        if (name && sMatch) return JSON.parse(unescape(sMatch[1]));
        return;
    }

    static setTokenCookie(token: object) {
        this.set('token', token, 24);
    }

    static getTokenCookie() {
        return this.get('token');
    }
}
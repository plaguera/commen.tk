import { Auth } from "./types";

export abstract class Requestable {

    private endpoint: string = 'https://api.github.com/';
    private auth : Auth;

    constructor(auth: Auth) {
        this.auth = auth;
    }

    abstract get(path: string): string;

    public async fetch(method: string, path: string, data?: Object): Promise<Object> {
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + this.auth.token
        };

        const init = {
            method: method,
            headers: headers,
            data: JSON.stringify(data),
            //responseType: 'json',
        };
        const res = await fetch(this.endpoint + path, init);
        let res_json = await res.json();
        return res_json;
    }
}
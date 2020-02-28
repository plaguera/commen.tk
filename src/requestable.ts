import { Auth } from "./types";

export abstract class Requestable {

    private endpoint: string = 'https://api.github.com/';
    private auth : Auth;

    constructor(auth: Auth) {
        this.auth = auth;
    }

    abstract get(path: string): string;

    public async fetch(method: string, path: string): Promise<Object> {
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + this.auth.token
        };

        const config = {
            method: method,
            headers: headers,
            responseType: 'json',
        };
        const res = await fetch(this.endpoint + path, config);
        let data = await res.json();
        return data;
    }
}
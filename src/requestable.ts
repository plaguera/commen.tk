import { Auth } from './auth';
import fetch from 'node-fetch';

export abstract class Requestable {

    private endpoint: string = 'https://api.github.com/';

    abstract get(path: string): string;

    public async fetch(method: string, path: string, data?: Object): Promise<Object> {
        let headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + Auth.token,
            'Content-Type': 'application/json',
        };
        const init = {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        };
        console.log(init);
        const res = await fetch(this.endpoint + path, init).catch((error) => console.error(error));
        return await res.json();
    }
}
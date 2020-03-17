import { Auth } from './auth';
import fetch from 'node-fetch';
import { Controller } from './controller';

export abstract class Requestable {

    endpoint: string = 'https://api.github.com/';

    abstract route(path?: string): string;

    async fetch(method: string, path: string, data?: object): Promise<object> {
        let init = {
            method: method,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + Controller.oauth.accessToken?.value,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        console.log(init);
        const res = await fetch(this.endpoint + path, init).catch((error) => console.error(error));
        return await res.json();
    }
    
}
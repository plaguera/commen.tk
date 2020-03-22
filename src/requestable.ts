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
                'Content-Type': 'application/json',
            }
        };
        if (Controller.oauth.authorized())
            init.headers['Authorization'] = 'token ' + Controller.oauth.accessToken;
        console.log(path + ' - ' + init.headers['Authorization']);
        if (data) init['body'] = JSON.stringify(data);
        return await fetch(this.endpoint + path, init).then(res => res.json()).catch((error) => console.error(error));
    }

}
import fetch from 'node-fetch';
import { Controller } from './controller';
import status from 'http-status';

export abstract class Requestable {

    endpoint: string = 'https://api.github.com/';

    abstract route(path?: string): string;

    async fetch(method: string, path: string, data?: object) {
        let init = {
            method: method,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            }
        };
        if (Controller.oauth.authorized())
            init.headers['Authorization'] = 'token ' + Controller.oauth.accessToken;
        console.log(init.headers['Authorization'] + ' - ' + path);
        if (data) init['body'] = JSON.stringify(data);
        return await fetch(this.endpoint + path, init);
    }

    async fetch_json(method: string, path: string, data?: object): Promise<object> {
        let response = await this.fetch(method, path, data);
        console.log('Status: ' + response.status + ' ' + status[`${response.status}_NAME`]);
        return await response.json();
    }

    async fetch_text(method: string, path: string, data?: object): Promise<string> {
        return await this.fetch(method, path, data).then(res => res.text());
    }

}
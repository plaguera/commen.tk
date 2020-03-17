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
                //'Authorization': 'token ' + Controller.oauth.accessToken?.value,
                'Content-Type': 'application/json',
            }
        };
        if (Controller.oauth.authorized())
            init.headers['Authorization'] = 'token ' + Controller.oauth.accessToken;
        if (data)
            init.headers['body'] = JSON.stringify(data);
        //console.log(init);
        return await fetch(this.endpoint + path, init).then(res => res.json()).catch((error) => console.error(error));
    }

}
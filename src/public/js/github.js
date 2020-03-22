import 'idempotent-babel-polyfill';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://plaguera-github-comments.herokuapp.com/' : 'http://localhost:3040/';
const API_URL = BASE_URL + 'api/';
export const AUTH_URL = BASE_URL + 'authorize/';

export class Github {
    static async fetch(method = 'GET', relativeURL, data) {
        var headers = { 'Content-Type': 'application/json' };
        if (method == 'POST') headers['Accept'] = 'application/json';

        const request = new Request(API_URL + relativeURL, {
            method: method,
            headers: headers,
            mode: 'cors',
            cache: 'no-cache'
        });
        if (data) request.body = JSON.stringify(data);

        return await fetch(request.url, request);
    }

    static async fetch_json(method = 'GET', relativeURL, data) {
        return await this.fetch(method, relativeURL, data).then(result => result.json());
    }

    static async fetch_text(method = 'GET', relativeURL, data) {
        return await this.fetch(method, relativeURL, data).then(result => result.text());
    }
}
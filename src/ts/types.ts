abstract class Requestable {

    url: string;

    constructor(url: string) {
        this.url = url;
    }

    async reload() {
        this.cast(await Github.fetch('GET', this.url).then(res => res.json()));
    }

    abstract cast(json: object): void;
}

class User extends Requestable {

    login: string;
    url: string;
    html_url: string;
    avatar_url: string;

    constructor(json: object) {
        super(`users/${json['login']}`);
        this.login = json['login'];
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.avatar_url = json['avatar_url'];
    }

    cast(json: object) {
        this.url = `users/${json['login']}`;
        this.login = json['login'];
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.avatar_url = json['avatar_url'];
    }

    

    static async me() {
        return await Github.user();
    }
}

const BASE_URL = process.env.NODE_ENV == 'production' ? 'https://plaguera-github-comments.herokuapp.com/' : 'http://localhost:3040/';
const API_URL = BASE_URL + 'api/';

class Github {
    static request(method: string = 'GET', relativeURL: string, data?: object) {
        var headers = { 'Content-Type': 'application/json' };
        if (method == 'POST') headers['Accept'] = 'application/json';

        const request = new Request(API_URL + relativeURL, {
            method: method,
            headers: headers,
            mode: 'cors',
            cache: 'no-cache',
            body: JSON.stringify(data)
        });

        //if (data) request.body = JSON.stringify(data);
        return request;
    }

    static async fetch(method: string = 'GET', relativeURL: string, data?: object) {
        return this.fetchRequest(this.request(method, relativeURL, data));
    }

    static async fetchRequest(request: Request) {
        return await fetch(request.url, request);
    }
}
import fetch from 'node-fetch';

export class Markdown {

    static async fetch(data: object) {
        let url = 'https://api.github.com/markdown';
        let init = {
            method: 'POST',
            body: JSON.stringify(data)
        };
        return await fetch(url, init).then(res => res.text()).catch((error) => console.error(error));
    }

    static async render(data: object) {
        return await Markdown.fetch(data);
    }

}
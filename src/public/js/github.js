import 'idempotent-babel-polyfill';
import { Auth } from './auth';
import { Issue, Repository } from './types';
import { CommentWidget } from './comment-widget';

const BASE_URL = 'https://plaguera-github-comments.herokuapp.com/';
//const BASE_URL = 'http://localhost:3040/';
const API_URL = BASE_URL + 'api/';
export const AUTH_URL = BASE_URL + 'authorize/';

export class Github {
    static request(relativeURL, method, data) {
        var headers = { 'Content-Type': 'application/json' };
        if (method == 'POST') {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        const request = new Request(API_URL + relativeURL, {
            method: method,
            headers: headers,
            mode: 'cors',
            cache: 'no-cache'
        });

        if (data) request.body = JSON.stringify(data);
        return request;
    }

    static async fetch(request) {
        const response = await fetch(request.url, request);
        if (response.status === 401) {
            token.value = null;
        }
        if (response.status === 403) {
            response.json().then(data => {
                if (data.message === 'Resource not accessible by integration') {
                    window.dispatchEvent(new CustomEvent('not-installed'));
                }
            });
        }
        if (request.method === 'GET' && [401, 403].indexOf(response.status) !== -1 &&
            request.headers.has('Authorization')) {
            request.headers.delete('Authorization');
            return Github.fetch(request);
        }
        return response;
    }

    static async renderMarkdown(body) {
        const req = Github.request('markdown', 'POST', { text: body, mode: 'markdown' });
        return await Github.fetch(req).then(res => res.text());
    }

    static async createComment(comment) {
        let url = `repos/${CommentWidget.attributes.user}/${CommentWidget.attributes.repo}/issues/${CommentWidget.attributes.issue}/comments`;
        const req = Github.request(url, 'POST', { 'body': comment });
        return await Github.fetch(req).then(res => res.json());
    }

    static async repos(user) {
        let url = `users/${user}/repos`;
        return await Github.fetch(Github.request(url))
            .then(result => result.json())
            .then(result => {
                let repos = [];
                for (let repo of result)
                    repos.push(new Repository(repo));
                return repos;
            });
    }

    static async issues(user, repo) {
        let url = `repos/${user}/${repo}/issues`;
        return await Github.fetch(Github.request(url))
            .then(result => result.json())
            .then(result => {
                let issues = [];
                for (let issue of result)
                    issues.push(new Issue(repo, issue));
                return issues;
            });
    }

    static async issue(user, repo, issueNumber) {
        let url = `repos/${user}/${repo}/issues/${issueNumber}`;
        return await Github.fetch(Github.request(url))
            .then(result => result.json());
    }

    static async comments(user, repo, issueNumber) {
        let url = `repos/${user}/${repo}/issues/${issueNumber}/comments`;
        return await Github.fetch(Github.request(url))
            .then(result => result.json());
    }

    static async user() {
        return await Github.fetch(Github.request('user')).then(res => res.json());
    }

    static async renderMarkdown(body) {
        const req = Github.request('markdown', 'POST', { text: body, mode: 'markdown' });
        return await Github.fetch(req).then(res => res.text());
    }
}
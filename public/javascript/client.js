//const BASE_URL = 'https://plaguera-github-comments.herokuapp.com/';
const BASE_URL = 'http://localhost:3040/';
const API_URL = BASE_URL + 'api/';
const AUTH_URL = BASE_URL + 'authorize/';

const USER_OR_ORG = 'plaguera';
const REPO = 'tfm-testing';

class Auth {
    static init() {
        Auth.token = undefined;
        if (!(Auth.token = Cookie.getTokenCookie())) {
            if (!(Auth.token = Auth.deparamUrl())) {
                console.log(`NO COOKIE NO PARAMS ${JSON.stringify(Auth.token)}`);
            } else {
                console.log(`NO COOKIE YES PARAMS ${JSON.stringify(Auth.token)}`);
                Cookie.setTokenCookie(Auth.token);
            }
        } else if (Auth.token = Auth.deparamUrl()) {
            console.log(`YES COOKIE YES PARAMS 1 ${JSON.stringify(Auth.token)}`);
            Cookie.setTokenCookie(Auth.token);
        } else if (Auth.token = Cookie.getTokenCookie()) {
            console.log(`YES COOKIE YES PARAMS 2 ${JSON.stringify(Auth.token)}`);
        }
    }

    static signedIn() {
        return Auth.token !== undefined;
    }

    static deparamUrl() {
        let params = decodeURI(location.href).split('?')[1];
        if (!params) return;
        window.history.replaceState(null, null, window.location.pathname);
        params = params.replace(/&/g, '","').replace(/=/g, '":"');
        return JSON.parse('{"' + params + '"}');
    }
}

class Cookie {
    static set(name, value, exhours) {
        var d = new Date();
        d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    static get(name) {
        var re = new RegExp('[; ]' + name + '=([^\\s;]*)');
        var sMatch = (' ' + document.cookie).match(re);
        if (name && sMatch) return JSON.parse(unescape(sMatch[1]));
        return;
    }

    static setTokenCookie(token) {
        this.set('token', token, 24);
    }

    static getTokenCookie() {
        return this.get('token');
    }
}

function githubRequest(relativeURL, method, data) {
    var headers = { 'Content-Type': 'application/json' };
    if (method == 'POST') {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    if (Auth.signedIn()) headers['Authorization'] = 'token ' + Auth.token['access_token'];
    const request = new Request(API_URL + relativeURL, {
        method: method,
        headers: headers,
        mode: 'cors',
        cache: 'no-cache'
    });

    if (data) request.body = JSON.stringify(data);
    return request;
}

function githubFetch(request) {
    return fetch(request.url, request).then(response => {
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
            request.headers.has('Authorization')
        ) {
            request.headers.delete('Authorization');
            return githubFetch(request);
        }
        return response;
    });
}

async function renderMarkdown(body) {
    const req = githubRequest('markdown', 'POST', { text: body, mode: 'markdown' });
    return await githubFetch(req).then(res => res.text());
}

class Comment {
    constructor(json) {
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.issue_url = json['issue_url'];
        this.id = json['id'];
        this.user = new User(json['user']);
        this.created_at = json['created_at'];
        this.body = json['body'];
    }
}

class Issue {
    constructor(json) {
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.repository_url = json['repository_url'];
        this.title = json['title'];
        this.number = json['number'];
        this.user = new User(json['user']);
        this.created_at = json['created_at'];
        this.comments = [];
    }

    async loadComments() {
        this.comments = [];
        let url = `repos/${USER_OR_ORG}/${REPO}/issues/${this.number}/comments`;
        const req = githubRequest(url);
        return await githubFetch(req).then(res => res.json()).then(res => {
            for (let comment of res) {
                this.comments.push(new Comment(comment));
            }
            return this.comments;
        });
    }
}

class User {
    constructor(json) {
        this.login = json['login'];
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.avatar_url = json['avatar_url'];
    }

    static async me() {
        let url = 'user';
        const req = githubRequest(url);
        return new User(await githubFetch(req).then(res => res.json()));
    }
}

class CommentComponent {
    constructor(comment) {
        this.element = document.createElement('div');
        this.element.className = 'timeline-item';
        renderMarkdown(comment.body).then(body => {
            this.element.innerHTML = `
            <div class="comment-component-avatar timeline-comment-avatar">
                <a href="${comment.user.html_url}">
                    <img class="avatar" src="${comment.user.avatar_url}" alt="${comment.user.login}">
                </a>
            </div>
            <div class="timeline-comment arrow_box">
                <div class="comment-header">
                    <a class="comment-header-anchor">
                        <strong class="">
                            <a class="author" href="${comment.user.login}">${comment.user.login}</a>
                        </strong>
                        commented
                        <a class="time-ago" title="${this.formatDate(comment.created_at)}" href="${comment.html_url}">
                            ${this.timeAgo(comment.created_at)}
                        <a/>
                    </a>
                </div>
                <div class="comment-body">
                <p>
                    ${body}
                </p>
                <div/>
            </div>`;
        });
        //console.log(this.timeAgo(comment.created_at));
    }

    formatDate(date) {
        return new Date(date).toGMTString();
    }

    timeElapsed(date) {
        let today = Date.now();
        let then = new Date(date);
        let seconds = Math.floor((today - then) / 1000);

        return {
            seconds: (((seconds % 31536000) % 86400) % 3600) % 60,
            minutes: Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
            hours: Math.floor(((seconds % 31536000) % 86400) / 3600),
            days: Math.floor((seconds % 31536000) / 86400),
            years: Math.floor(seconds / 31536000)
        };
    }

    timeAgo(date) {
        let time = this.timeElapsed(date);
        if (time.years > 0)
            return time.years + ' years ago';
        else if (time.days > 0)
            return time.days + ' days ago';
        else if (time.hours > 0)
            return time.hours + ' hours ago';
        else if (time.seconds > 10)
            return time.seconds + ' seconds ago';
        else
            return 'just now';
    }
}

class MarkdownEditorComponent {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'markdown-editor-component';

        if (Auth.signedIn()) {
            User.me().then(me => {
                this.element.innerHTML = `
                <div class="editor-component-avatar timeline-comment-avatar">
                    <a href="${me.html_url}">
                        <img class="avatar" src="${me.avatar_url}">
                    </a>
                </div>
                <div class="editor-component arrow_box">
                    <div class="editor-textarea-component">
                        <textarea class="editor-textarea" placeholder="Leave a comment"></textarea>
                    </div>
                    <div class="editor-component-btn">
                        <button class="btn btn-primary">
                            Comment
                        </button>
                    </div>
                </div>`;
            });
        } else {
            this.element.innerHTML = `
            <div class="editor-component">
                <div class="editor-textarea-component">
                    <textarea class="editor-textarea" placeholder="Leave a comment" disabled></textarea>
                </div>
                <div class="editor-component-btn">
                    <a class="btn btn-primary" href="${AUTH_URL}">
                        Sign In
                    </a>
                </div>
            </div>`;
        }
    }
}

class TimelineComponent {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'timeline-component';
        let comments = document.createElement('div');
        comments.className = 'comment-list';

        this.loadIssue(1).then(issue => {
            issue.loadComments().then(result => {
                for (let comment of result) {
                    comments.appendChild(new CommentComponent(new Comment(comment)).element);
                }
                this.element.appendChild(comments);
            });
        });
    }

    async loadIssue(issueNumber) {
        let url = `repos/${USER_OR_ORG}/${REPO}/issues/${issueNumber}`;
        const req = githubRequest(url);
        return new Issue(await githubFetch(req).then(res => res.json()));
    }
}

class CommentWidget {
    constructor() {
        this.root = document.getElementsByClassName("comment-widget")[0];
        this.loadCSS(BASE_URL + 'public/stylesheets/style.css');
        this.root.appendChild(new TimelineComponent().element);
        let separator = document.createElement('hr');
        separator.className = 'solid';
        this.root.appendChild(separator);
        this.root.appendChild(new MarkdownEditorComponent().element);
    }

    loadCSS(url) {
        var link_tag = document.createElement('link');
        link_tag.setAttribute("type", "text/css");
        link_tag.setAttribute("rel", "stylesheet");
        link_tag.setAttribute("href", url);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
    }
}

Auth.init();
var x = new CommentWidget();
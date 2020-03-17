const BASE_URL = 'https://plaguera-github-comments.herokuapp.com/'; // 'http://localhost:3040/';
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
        this.set('token', token, 12);
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

class IssueComponent {
    constructor(issue) {
        this.issue = issue;
        this.element = document.createElement('div');
        this.element.className = 'issue-component';
        this.element.id = 'issue-' + issue['number'];

        for (const property in issue) {
            let wrapper = document.createElement('div');
            let key = document.createElement('label');
            let value = document.createElement('a');
            key.className = 'issue-component-property-key';
            value.className = 'issue-component-property-value';

            key.textContent = property;
            value.textContent = issue[property];
            if (property.includes('url'))
                value.href = issue[property];
            else if (property == 'user') {
                value.textContent = issue[property]['login'];
                value.href = issue[property]['html_url'];
            }
            wrapper.appendChild(key);
            wrapper.appendChild(value);

            wrapper.className = 'issue-component-property';
            wrapper.id = property;
            this.element.appendChild(wrapper);
        }

        this.issue.loadComments().then(() => {
            for (let comment of this.issue.comments)
                this.element.appendChild(new CommentComponent(comment).element);
        });
    }
}

class CommentComponent {
    constructor(comment) {
        this.element = document.createElement('div');
        this.element.className = 'timeline-item';

        let avatarDiv = document.createElement('div');
        avatarDiv.classList.add('comment-component-avatar');
        avatarDiv.classList.add('timeline-comment-avatar');
        let avatar = document.createElement('img');
        avatar.classList.add('avatar');
        avatar.src = comment.user.avatar_url;
        avatarDiv.appendChild(avatar);

        let timelineComment = document.createElement('div');
        timelineComment.classList.add('timeline-comment');
        timelineComment.classList.add('arrow_box');

        let commentHeader = document.createElement('div');
        commentHeader.className = 'comment-header';
        let headerAnchor = document.createElement('a');
        headerAnchor.className = 'comment-header-anchor';
        let headerUsername = document.createElement('strong');
        headerUsername.className = 'comment-header-username';
        headerUsername.textContent = comment.user.login;

        let commentBody = document.createElement('p');
        commentBody.className = 'comment-body';
        commentBody.textContent = comment.body;

        headerAnchor.appendChild(headerUsername);
        commentHeader.appendChild(headerAnchor);
        timelineComment.appendChild(commentHeader);
        timelineComment.appendChild(commentBody);

        this.element.appendChild(avatarDiv);
        this.element.appendChild(timelineComment);
    }
}

class MarkdownEditorComponent {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'markdown-editor-component';
        let avatarDiv = document.createElement('div');
        avatarDiv.className = 'editor-component-avatar';
        avatarDiv.classList.add('editor-component-avatar');
        avatarDiv.classList.add('timeline-comment-avatar');
        let avatar = document.createElement('img');
        avatar.classList.add('avatar');
        if (Auth.signedIn()) {
            User.me().then(result => avatar.src = result.avatar_url);
        }
        avatarDiv.appendChild(avatar);

        let arrow = document.createElement('div');
        arrow.className = 'arrow-left';
        let editor = document.createElement('div');
        editor.classList.add('editor-component');
        editor.classList.add('arrow_box');

        let editorTextComponent = document.createElement('div');
        editorTextComponent.className = 'editor-textarea-component';
        let textarea = document.createElement('textarea');
        textarea.className = 'editor-textarea';
        textarea.placeholder = 'Leave a comment'
        editorTextComponent.appendChild(textarea);

        let commentDiv = document.createElement('div');
        commentDiv.className = 'editor-component-btn';
        let commentBtn;
        if (!Auth.signedIn()) {
            commentBtn = document.createElement('a');
            commentBtn.textContent = 'Sign In';
            commentBtn.href = AUTH_URL;
        } else {
            commentBtn = document.createElement('button');
            commentBtn.textContent = 'Comment';
            commentBtn.addEventListener("click", function(e) {
                //comments.appendChild(new CommentComponent().element);
                console.log(Date.now().toString());
            }, false);
        }

        commentBtn.classList.add('btn');
        commentBtn.classList.add('btn-primary');
        commentDiv.appendChild(commentBtn);

        editor.appendChild(editorTextComponent);
        editor.appendChild(commentDiv);

        this.element.appendChild(avatarDiv);
        this.element.appendChild(editor);
        //this.renderMD();
    }

    async renderMD() {
        let body = {
            "text": "Hello world github/linguist#1 **cool**, and #1!",
            "mode": "markdown",
            //"context": "github/gollum"
        }

        const req = githubRequest('markdown', 'POST', body);
        return await githubFetch(req).then(res => res.text()).then(res => {
            console.log(res);
        });
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
                for (let comment of result)
                    comments.appendChild(new CommentComponent(new Comment(comment)).element);
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
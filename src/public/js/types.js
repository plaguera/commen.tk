import { Github } from "./github";

export class User {
    constructor(json) {
        this.login = json['login'];
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.avatar_url = json['avatar_url'];
    }

    static async find(user) {
        let url = user ? `users/${user}` : 'user';
        return new User(await Github.fetch_json('GET', url));
    }

    static async me() {
        return await User.find();
    }

    async repos() {
        let url = `users/${this.login}/repos`;
        return await Github.fetch_json('GET', url)
            .then(result => {
                let repos = [];
                for (let repo of result)
                    repos.push(new Repository(repo));
                return repos;
            });
    }
}

export class Repository {
    constructor(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.full_name = json['full_name'];
        this.owner = new User(json['owner']);
    }

    static async find(user, repo) {
        let url = `repos/${user}/${repo}`;
        return new Repository(await Github.fetch_json('GET', url));
    }

    async issue(issue) {
        let url = `repos/${this.full_name}/issues/${issue}`;
        return new Issue(await Github.fetch_json('GET', url));
    }

    async issues() {
        let url = `repos/${this.full_name}/issues`;
        return await Github.fetch_json('GET', url)
            .then(result => {
                let issues = [];
                for (let issue of result)
                    issues.push(new Issue(issue));
                return issues;
            });
    }
}

export class Issue {
    constructor(json) {
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.repository = json['repository_url'].replace('https://api.github.com/repos/', '');
        this.repository_url = json['repository_url'];
        this.title = json['title'];
        this.number = json['number'];
        this.user = new User(json['user']);
        this.created_at = json['created_at'];

    }

    static async find(user, repo, issue) {
        let url = `repos/${user}/${repo}/issues/${issue}`;
        return new Issue(await Github.fetch_json('GET', url));
    }

    async comments() {
        let url = `repos/${this.repository}/issues/${this.number}/comments`;
        return await Github.fetch_json('GET', url)
            .then(result => {
                let comments = [];
                for (let comment of result)
                    comments.push(new Comment(comment));
                return comments;
            });
    }

    async create_comment(comment) {
        let url = `repos/${this.repository}/issues/${this.number}/comments`;
        return await Github.fetch_json('POST', url, { 'body': comment });
    }
}

export class Comment {
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

export class Markdown {
    static async convert(body) {
        return await Github.fetch_text('POST', 'markdown', { text: body, mode: 'gfm' });
    }
}
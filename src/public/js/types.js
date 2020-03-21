import { Github } from "./github";

export class User {
    constructor(json) {
        this.login = json['login'];
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.avatar_url = json['avatar_url'];
    }

    static async me() {
        return await Github.user();
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

export class Issue {
    constructor(json) {
        this.url = json['url'];
        this.html_url = json['html_url'];
        this.repository_url = json['repository_url'];
        this.comments_url = json['comments_url'];
        this.title = json['title'];
        this.number = json['number'];
        this.user = new User(json['user']);
        this.created_at = json['created_at'];
    }

    async comments() {
        return await Github.comments(this.comments_url);
    }
}

export class Repository {
    constructor(json) {
        this.id = json['id'];
        this.name = json['name'];
        this.full_name = json['full_name'];
    }
}
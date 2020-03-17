import { Requestable } from './requestable'

export class Repository extends Requestable {

    username: string;
    reponame: string;

    constructor(username: string, reponame: string) {
        super();
        this.username = username;
        this.reponame = reponame;
    }

    route(path?: string): string {
        if (this.username && this.reponame)
            return path ? `repos/${this.username}/${this.reponame}/${path}` : `repos/${this.username}/${this.reponame}`;
        return 'user/repos'
    }

    async get() {
        return await this.fetch('GET', this.route());
    }

    async issue(issue_id: number) {
        return await this.fetch('GET', this.route(`issues/${issue_id}`));
    }

    async issues() {
        return await this.fetch('GET', this.route('issues'));
    }

    async comment(comment_id: number) {
        return await this.fetch('GET', this.route(`issues/comments/${comment_id}`));
    }

    async comments(issuenumber: number) {
        return await this.fetch('GET', this.route(`issues/${issuenumber}/comments`));
    }

    async create_issue(data: Object) {
        return await this.fetch('POST', this.route('issues'), data);
    }

    async create_comment(issuenumber: number, data: Object) {
        return await this.fetch('POST', this.route(`issues/${issuenumber}/comments`), data);
    }
}
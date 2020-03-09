import { Requestable } from './requestable'

export class Repository extends Requestable {

    username: string;
    reponame: string;

    constructor(username: string, reponame: string) {
        super();
        this.username = username;
        this.reponame = reponame;
    }

    get(path: string): string {
        if (this.username && this.reponame)
            return path ? `repos/${this.username}/${this.reponame}/${path}` : `repos/${this.username}/${this.reponame}`;
        return 'user/repos'
    }

    async issues() {
        return await this.fetch('GET', this.get('issues'));
    }

    async comment(comment_id: number) {
        return await this.fetch('GET', this.get(`issues/comments/${comment_id}`));
    }

    async comments(issuenumber: number) {
        return await this.fetch('GET', this.get(`issues/${issuenumber}/comments`));
    }

    async json(path: string) {
        return await this.fetch('GET', this.get(path));
    }

    async create_issue(data: Object) {
        return await this.fetch('POST', this.get('issues'), data);
    }

    async create_comment(issuenumber: number, data: Object) {
        return await this.fetch('POST', this.get(`issues/${issuenumber}/comments`), data);
    }
}
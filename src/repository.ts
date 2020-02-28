import { Requestable } from './requestable'
import { Auth } from "./types";

export class Repository extends Requestable {

    username: string;
    reponame: string;

    constructor(auth: Auth, username: string, reponame: string) {
        super(auth);
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

    async comments(issuenumber: number) {
        return await this.fetch('GET', this.get(`issues/${issuenumber}/comments`));
    }

    async json(path: string) {
        return await this.fetch('GET', this.get(path));
    }

    async create_issue(title: string, body: string) {
        return await this.fetch('POST', this.get('issues'), {
            "title": title
        });
    }
}
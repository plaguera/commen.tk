import { Requestable } from './requestable'

export class User extends Requestable {

    username: string | undefined;

    constructor(username?: string) {
        super();
        this.username = username;
    }

    route(path?: string): string {
        if (this.username)
            return path ? `users/${this.username}/${path}` : `users/${this.username}`;
        return 'user'
    }

    async get(path?: string) {
        return await this.fetch('GET', this.route(path));
    }
}
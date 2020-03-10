import { Requestable } from './requestable'

export class User extends Requestable {

    username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }

    get(path: string): string {
        if (this.username)
            return path ? `users/${this.username}/${path}` : `users/${this.username}`;
        return 'user'
    }

    async json(path: string) {
        return await this.fetch('GET', this.get(path));
    }
}
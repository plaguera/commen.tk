import { Requestable } from './requestable'
import { Auth } from "./types";

export type Organization = User;

export class User extends Requestable {

    username: string;

    constructor(auth: Auth, username: string) {
        super(auth);
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
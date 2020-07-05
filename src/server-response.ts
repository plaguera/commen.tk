import { Response } from 'node-fetch';

export class ServerResponse {

    url: string = '';
    status: number = -1;
    statusText: string = '';
    data?: any = undefined;

    constructor(res: void | Response, data?: any) {
        if (res) {
            this.url = res.url;
            this.status = res.status;
            this.statusText = res.statusText;
            this.data = data.data;
        }
    }
}
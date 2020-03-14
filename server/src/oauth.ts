import fetch from 'node-fetch';

interface AccessToken {
    value: string;
    type: string;
    scope: string;
} 

export class OAuth {

    accessToken: AccessToken = { value: '', type: '', scope: '' };
    accessTokenURL: string = 'https://github.com/login/oauth/access_token';
    code: string = '';

    getParamURL(): string {
        return  this.accessTokenURL
                + `?client_id=${process.env.CLIENT_ID}`
                + `&client_secret=${process.env.CLIENT_SECRET}`
                + `&code=${this.code}`; 
    }

    authorized(): boolean {
        return this.accessToken !== undefined;
    }

    async access_token(code: string) {
        this.code = code;
        let res = await this.fetch('POST', this.getParamURL());

        let json = JSON.parse(res);
        this.accessToken.value = json['access_token'];
        this.accessToken.type = json['token_type'];
        this.accessToken.scope = json['scope'];

        return res;
    }

    async fetch(method: string, url: string): Promise<object> {
        let init = {
            method: method,
            headers: {
                Accept: 'application/json' 
            }
        };
        const res = await fetch(url, init).catch((error: any) => console.error(error));
        return await res.text();
    }

}
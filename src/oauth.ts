import fetch from 'node-fetch';
import querystring from 'query-string';

interface AccessToken {
    access_token: string;
    token_type: string;
    scope: string;
} 

export class OAuth {

    accessToken: string = '';
    accessTokenURL: string = 'https://github.com/login/oauth/access_token';
    code: string = '';
    redirectURI: string = '';

    getParamURL(): string {
        return  this.accessTokenURL
                + `?client_id=${process.env.CLIENT_ID}`
                + `&client_secret=${process.env.CLIENT_SECRET}`
                + `&code=${this.code}`
                //+ `&redirect_uri=${this.redirectURI}`; 
    }

    authorize(referer?: string) {
        if (referer)
            this.redirectURI = referer;
        return 'https://github.com/login/oauth/authorize'
                + `?client_id=${process.env.CLIENT_ID}`;
                //+ `?redirect_uri=${this.redirectURI}`;
    }

    authorized() {
        return this.accessToken !== '';
    }

    async access_token(code: string) {
        this.code = code;
        return await this.fetch('POST', this.getParamURL());
    }

    async fetch(method: string, url: string): Promise<string> {
        let init = {
            method: method,
            headers: {
                Accept: 'application/json' 
            }
        };
        return await fetch(url, init).then(res => res.text()).then(body => JSON.parse(body)).catch((error) => console.error(error));
    }

}
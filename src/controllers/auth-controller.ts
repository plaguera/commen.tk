import { Request, Response } from 'express';
import { Controller } from './controller';
import * as request from '../request';

const ACCESS_TOKEN_BASE_URL = 'https://github.com/login/oauth/access_token';
const CLIENT_ID = process.env[`${process.env.NODE_ENV}_CLIENT_ID`];
const CLIENT_SECRET = process.env[`${process.env.NODE_ENV}_CLIENT_SECRET`];

export class AuthController extends Controller {
	static async authorize(req: Request, res: Response) {
		let redirect_url =
			'https://github.com/login/oauth/authorize'
			+ `?client_id=${CLIENT_ID}`
			+ `&scope=repo`
			//+ `&redirect_uri=http://localhost:8000/oauth/redirect`;
		res.redirect(redirect_url);
	}

	static async access_token(req: Request, res: Response) {
		let code = req.query.code;
		let accessTokenUrl =
			ACCESS_TOKEN_BASE_URL
			+ `?client_id=${CLIENT_ID}`
			+ `&client_secret=${CLIENT_SECRET}`
			+ `&code=${code}`;
        let accessToken = await request.post(accessTokenUrl);
        
		console.log('1 - ' + accessToken['access_token']);
        console.log('2 - ' + req.headers.referer);
        
		var cookie = req.cookies.token;
		if (cookie === undefined) {
			res.cookie('token', accessToken['access_token'], {
				//httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
			});
			res.cookie('loggedin', true, {
                maxAge: 24 * 60 * 60 * 1000,
			});
			console.log('cookie created successfully');
		} else {
			// TODO: Update cookie access_token
			console.log('cookie exists', cookie);
        }
        
		// TODO: referer ends with /
		res.redirect(req.headers.referer || '');
	}
}

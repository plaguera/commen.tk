import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import * as request from '../request';
import crypto from 'crypto';

const OAUTH_URL = 'https://github.com/login/oauth/';
const URL_AUTH = 'authorize';
const URL_ACCT = 'access_token';
const CLIENT_ID = process.env[`${process.env.NODE_ENV}_CLIENT_ID`];
const CLIENT_SECRET = process.env[`${process.env.NODE_ENV}_CLIENT_SECRET`];

export class AuthController extends Controller {
	static referers: object = {};

	static async authorize(req: Request, res: Response) {
		let state = crypto.randomBytes(64).toString('hex');
		AuthController.referers[state] = req.headers.referer;

		let redirect_url =
			OAUTH_URL +
			URL_AUTH +
			`?client_id=${CLIENT_ID}` +
			`&scope=repo` +
			`&state=${state}`;
		res.redirect(redirect_url);
	}

	static async access_token(req: Request, res: Response) {
		let code = req.query.code;
		let accessTokenUrl =
			OAUTH_URL +
			URL_ACCT +
			`?client_id=${CLIENT_ID}` +
			`&client_secret=${CLIENT_SECRET}` +
			`&code=${code}`;
		let accessToken = await request.post(accessTokenUrl);
		let referer = AuthController.referers[req.query.state];

		console.log('1 - ' + accessToken['access_token']);
		console.log('2 - ' + referer);

		console.log(req.session);
		var cookie = req.cookies.token;
		if (cookie === undefined) {
			let options : CookieOptions = {
				//httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				//sameSite: "lax",
				//secure: true
			};
			//res.cookie('token', accessToken['access_token'], options);
			//res.cookie('loggedin', true, options);
			//res.setHeader('Set-Cookie', `token=${accessToken['access_token']}; Path=/token; HttpOnly; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 356}`);
			//res.setHeader('Set-Cookie', `loggedin=true; Path=/token; HttpOnly; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 356}`);
			console.log('cookie created successfully');
		} else {
			// TODO: Update cookie access_token
			console.log('cookie exists', cookie);
		}

		// TODO: referer ends with /
		res.redirect(referer);
		delete AuthController.referers[req.query.state];
	}
}

import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import crypto from 'crypto';
import { post } from '../request';

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
			console.log(accessTokenUrl);
		let at = (await post(accessTokenUrl)).access_token;
		let referer = AuthController.referers[<string>req.query.state];
		console.log('AT - ' + at);
		console.log('REF - ' + referer);

		Controller.checkCookie(req, res, 'token', at, 24 * 60 * 60 * 1000);
		res.redirect(referer);
		delete AuthController.referers[<string>req.query.state];
	}
}

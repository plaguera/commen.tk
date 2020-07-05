import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import crypto from 'crypto';
import fetch from 'node-fetch';
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

		console.log(process.env.NODE_ENV)
		if (process.env.NODE_ENV === 'PRODUCTION') {
			let cookie = req.signedCookies.token;
			if (cookie === undefined) {
				console.log('CREATE COOKIE - ACCESS TOKEN');
				let options : CookieOptions = {
					httpOnly: true,
					maxAge: 24 * 60 * 60 * 1000,
					sameSite: 'none',
					secure: true,
					signed: true
				};
				res.cookie('token', at, options);
			}
		} else if (process.env.NODE_ENV === 'DEVELOPMENT') {
			let cookie = req.cookies.token;
			if (cookie === undefined) {
				console.log('CREATE COOKIE - ACCESS TOKEN');
				let options : CookieOptions = {
					httpOnly: true,
					maxAge: 24 * 60 * 60 * 1000,
					signed: true
				};
				res.cookie('token', at, options);
			}
		}
		res.redirect(referer);
		delete AuthController.referers[<string>req.query.state];
	}
}

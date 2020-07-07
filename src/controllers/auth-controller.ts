import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import crypto from 'crypto';
import { post } from '../request';
import log from '../logger';

const OAUTH_URL = 'https://github.com/login/oauth/';
const URL_AUTH = 'authorize';
const URL_ACCT = 'access_token';
const CLIENT_ID = process.env[`${process.env.NODE_ENV}_CLIENT_ID`];
const CLIENT_SECRET = process.env[`${process.env.NODE_ENV}_CLIENT_SECRET`];

/**
 * Controller in charge of oauth process.
 */
export class AuthController extends Controller {
	/**
	 * Dictionary where randomly generated 'states' are the key and referer urls are their values.
	 */
	static referers: object = {};

	/**
	 * Generates random 'state' and redirects the client to an app-specific GitHub oauth url.
	 * @param req Request
	 * @param res Response
	 */
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

	/**
	 * Requests access token from GitHub using @code in @req and stores it in a cookie with 24-hour validity.
	 * Then redirects the client to its start url stored un @referers
	 * @param req Request contains code and state
	 * @param res Response stores access token cookie
	 */
	static async access_token(req: Request, res: Response) {
		let code = req.query.code;
		let accessTokenUrl =
			OAUTH_URL +
			URL_ACCT +
			`?client_id=${CLIENT_ID}` +
			`&client_secret=${CLIENT_SECRET}` +
			`&code=${code}`;
		let at = (await post(accessTokenUrl)).access_token;
		let referer = AuthController.referers[<string>req.query.state];
		log.debug('Access Token', at);
		log.debug('Referer', referer);

		Controller.checkCookie(req, res, 'token', at, 24 * 60 * 60 * 1000);
		res.redirect(referer);
		delete AuthController.referers[<string>req.query.state];
	}
}

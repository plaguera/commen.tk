import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import crypto from 'crypto';
import { post } from '../request';
import log from '../logger';
import env from '../environment';

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
			env.oauth.url_authorize +
			`?client_id=${env.oauth.client_id}` +
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
			env.oauth.url_access_token +
			`?client_id=${env.oauth.client_id}` +
			`&client_secret=${env.oauth.client_secret}` +
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

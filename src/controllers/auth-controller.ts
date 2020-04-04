import { Request, Response, CookieOptions } from 'express';
import { Controller } from './controller';
import * as request from '../request';
import crypto from 'crypto';
var cookie = require('cookie');
var signature = require('cookie-signature');

const OAUTH_URL = 'https://github.com/login/oauth/';
const URL_AUTH = 'authorize';
const URL_ACCT = 'access_token';
const CLIENT_ID = process.env[`${process.env.NODE_ENV}_CLIENT_ID`];
const CLIENT_SECRET = process.env[`${process.env.NODE_ENV}_CLIENT_SECRET`];

function setcookie(res, name, val, secret, options) {
	var signed = 's:' + signature.sign(val, secret);
	var data = cookie.serialize(name, signed, options);
  
	console.log('set-cookie %s', data);
  
	var prev = res.getHeader('Set-Cookie') || []
	var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];
  
	res.setHeader('Set-Cookie', header)
  }

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

		console.log('AT - ' + accessToken['access_token']);
		console.log('REF - ' + referer);

		let cookie = req.cookies.token;
		if (cookie === undefined) {
			console.log('Create Cookie');
			let options : CookieOptions = {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				sameSite: "none",
				secure: true
			};
			res.cookie('token', accessToken['access_token'], options);
		}

		// TODO: referer ends with /
		res.redirect(referer);
		delete AuthController.referers[req.query.state];
	}
}

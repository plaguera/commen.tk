import { Request, Response, CookieOptions } from 'express';
import { graphql } from '@octokit/graphql';
import { InstallationController } from './installation-controller';
import log from '../logger';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import env from '../environment';

/**
 * Base class for server controllers
 */
export class Controller {
	/**
	 * Send @res with status code @status and payload @data
	 * @param res Response
	 * @param status Status Code
	 * @param data Payload
	 */
	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}

	/**
	 * Check whether @req has an access token cookie or and installation access token cookie.
	 * Check for authorization header, used only in testing.
	 * If none of the above exist, a new installation access token cookie is created and sent with @res
	 * @param req Request
	 * @param res Response
	 */
	static async token(req: Request, res: Response) {
		if (req.signedCookies.token) {
			return req.signedCookies.token;
		} else if (req.signedCookies.installation_token) {
			return req.signedCookies.installation_token;
		} else if (req.headers.authorization) {
			return req.headers.authorization.substring(6);
		} else {
			return await InstallationController.installation_access_token(req, res).catch(console.error);
		}
	}

	/**
	 * Check if @name cookie exists in @req, if it does, do nothing.
	 * If it doesn't create @name cookie with @value and @maxAge in @res and send it.
	 * Development builds don't use HTTPS, thus cookies can't have the @secure attribute, without @secure, 'Samesite: none' can't be used.
	 * @param req Request
	 * @param res Response
	 * @param name Cookie Name
	 * @param value Cookie Value
	 * @param maxAge Cookie Time to Live in milliseconds
	 */
	static checkCookie(req: Request, res: Response, name: string, value: string, maxAge: number) {
		let cookie = req.signedCookies[name];
		if (cookie !== undefined) {
			log.debug(`Cookie Exists [${name}]`);
			return;
		}

		let options: CookieOptions;
		if (env.production) {
			options = {
				//httpOnly: true,
				maxAge: maxAge,
				sameSite: 'none',
				secure: true,
				signed: true
			};
		} else {
			options = {
				httpOnly: true,
				maxAge: maxAge,
				signed: true
			};
		}
		res.cookie(name, value, options);
		log.debug(`Created Cookie [${name}]`);
	}

	static async graphql(req: Request, res: Response, query: RequestParameters, dontSend: boolean = false): Promise<any> {
		let token = await Controller.token(req, res);
		if (query.headers) query.headers.authorization = `token ${token}`;
		else query.headers = { authorization: `token ${token}` };
		try {
			const result = await graphql<any>(query);
			if (!dontSend) Controller.sendResponse(res, 200, result);
			return result;
		} catch (error) {
			console.log('GraphQL Query FAIL', error.message);
			Controller.sendResponse(res, error.status, error.message);
		}
	}
}
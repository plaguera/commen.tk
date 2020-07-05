import { Request, Response, CookieOptions } from 'express';
import { InstallationController } from './installation-controller';

export class Controller {
	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}

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

	static checkCookie(req: Request, res: Response, name: string, value: string, maxAge: number) {
		if (process.env.NODE_ENV === 'PRODUCTION') {
			let cookie = req.signedCookies[name];
			if (cookie === undefined) {
				let options : CookieOptions = {
					//httpOnly: true,
					maxAge: maxAge,
					sameSite: 'none',
					secure: true,
					signed: true
				};
				res.cookie(name, value, options);
				console.log(`Created Cookie [${name}]`);
			} else console.log(`Cookie Exists [${name}]`);
		} else if (process.env.NODE_ENV === 'DEVELOPMENT') {
			let cookie = req.signedCookies[name];
			if (cookie === undefined) {
				
				let options : CookieOptions = {
					httpOnly: true,
					maxAge: maxAge,
					signed: true
				};
				res.cookie(name, value, options);
				console.log(`Created Cookie [${name}]`);
			} else console.log(`Cookie Exists [${name}]`);
		}
	}
}

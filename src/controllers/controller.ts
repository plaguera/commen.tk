import { Request, Response } from 'express';
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
			return await InstallationController.installation_access_token(req, res);
		}
	}

	static async installation_token(req: Request, res: Response) {
		if (req.signedCookies.installation_token) {
			return req.signedCookies.installation_token;
		} else {
			return await InstallationController.installation_access_token(req, res);
		}
	}
}

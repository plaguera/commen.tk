import { Request, Response } from 'express';
export class Controller {
	static token: string;

	static getToken(req: Request, res: Response, next) {
		//console.log(req.headers.authorization);
		if (req.session) {
			if (req.session.views) {
				req.session.views++;
			} else {
				req.session.views = 1;
				//res.end('welcome to the session demo. refresh!');
			}
		}
		if (req.headers.authorization)
			Controller.token = req.headers.authorization;
		next();
	}

	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}
}

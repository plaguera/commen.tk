import { Request, Response } from 'express';
export class Controller {
	static token: string;

	static getToken(req: Request, res: Response, next) {
		//console.log(req.headers.authorization);
		if (req.session) {
			console.log('IF 1');
			if (req.session.views) {
				console.log('IF 2');
				req.session.views++;
			} else {
				console.log('IF 3');
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

import { Request, Response } from 'express';
export class Controller {
	static token: string;

	static getToken(req: Request, res: Response, next) {
		//console.log(req.headers.authorization);
		if (req.headers.authorization)
			Controller.token = req.headers.authorization;
		next();
	}

	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}
}

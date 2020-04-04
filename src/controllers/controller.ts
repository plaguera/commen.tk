import { Request, Response } from 'express';
export class Controller {
	static token: string;

	static getToken(req: Request, res: Response, next) {
		console.log(req.cookies);
		if (req.cookies.token)
			Controller.token = req.cookies.token;
		next();
	}

	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}
}

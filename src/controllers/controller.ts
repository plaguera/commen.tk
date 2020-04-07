import { Response } from 'express';
export class Controller {
	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}
}

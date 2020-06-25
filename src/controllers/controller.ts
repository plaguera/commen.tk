import { Request, Response } from 'express';
import { InstallationController } from './installation-controller';
import { query } from '../request';

export class Controller {
	static sendResponse(res: Response, status: number, data: any) {
		res.status(status).send(data);
	}
}

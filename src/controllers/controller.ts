import { Request, Response } from 'express';
import httpStatus from 'http-status';
import fetch from 'node-fetch';

export class Controller {
    static sendResponse(res: Response, status: number, data: any) {
        res.status(status).send(data);
    }
}
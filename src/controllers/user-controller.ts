import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';

export class UserController extends Controller {
    static get(req: Request, res: Response) {
        let obj = req.params.id ? `user(login: "${req.params.id}")` : 'viewer';
        let data = `{
            ${obj} {
                login,
                url,
                avatarUrl
            }
        }`;
        query(data).then(api => UserController.sendResponse(res, api.status, api.data));
    }
}
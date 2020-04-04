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
        let token = req.params.id ? req.cookies.token || process.env.DEFAULT_GITHUB_TOKEN : req.cookies.token;
        query(data, token).then(api => UserController.sendResponse(res, api.status, api.data));
    }
}
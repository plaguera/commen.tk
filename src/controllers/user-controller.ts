import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';

export class UserController extends Controller {

    static async get(req: Request, res: Response) {
        let head = req.params.id ? `user(login: "${req.params.id}")` : 'viewer';
        let data = `{
            ${head} {
                login,
                url,
                avatarUrl
            }
        }`;
        if (!req.params.id && !req.signedCookies.token)
            UserController.sendResponse(res, 200, { data: { viewer: undefined } })
        else {
            res.set('Cache-Control', 'max-age=600');
            let token = await Controller.token(req, res);
            let queryres = await query(data, token);
            UserController.sendResponse(res, queryres.status, queryres.data);
        }
    }
    
}
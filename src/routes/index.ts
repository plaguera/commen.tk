import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { IssueController } from '../controllers/issue-controller';
import { AuthController } from '../controllers/auth-controller';
import { CommentController } from '../controllers/comment-controller';

const routes = Router();

const indexHTML = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>API commen.tk</title><meta name="description" content="API for commen.tk" /><meta name="author" content="plaguera" /></head><body><h1 style="font-family: Arial, Helvetica, sans-serif;">API is <strong style="color: green;">UP</strong></h1></body></html>';

routes.route('/').all((req, res) => res.status(200).send(indexHTML));

routes.route('/user').get(UserController.get)
routes.route('/users/:id').get(UserController.get);

routes.route('/comments/:owner/:repo/:issue').get(CommentController.get);
routes.route('/comments/:owner/:repo/:issue').post(CommentController.post);
routes.route('/comments/:id').delete(CommentController.delete);

routes.route('/issues/:owner/:repo/:name').get(IssueController.processIssueName);
routes.route('/issues/:owner/:repo').post(IssueController.post);
routes.route('/issues/:repoid').post(IssueController.post);
routes.route('/issues/:id').delete(IssueController.delete);

routes.route('/authorize').get(AuthController.authorize);
routes.route('/oauth/redirect').get(AuthController.access_token);
routes.route('/logout').get(AuthController.logout);

export default routes;
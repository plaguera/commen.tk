import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { IssueController } from '../controllers/issue-controller';
import { AuthController } from '../controllers/auth-controller';

const routes = Router();

routes.route("/api/user").get(UserController.get)
routes.route("/api/users/:id").get(UserController.get);
routes.route("/api/comments/:user/:repo/:issuenumber").get(IssueController.get);
routes.route("/api/comments/:user/:repo/:issuenumber").post(IssueController.post);
routes.route("/api/comments/:user/:repo/:issuenumber/:pagesize").get(IssueController.get);
routes.route("/api/comments/:user/:repo/:issuenumber/:pagesize/:cursor").get(IssueController.get);
//routes.route("/api/repos/:user/:repo/issues/:issuenumber/comments").get(IssueController.get);
//routes.route("/api/repos/:user/:repo/issues/:issuenumber/comments").post(IssueController.post);
routes.route("/authorize").get(AuthController.authorize);
routes.route("/oauth/redirect").get(AuthController.access_token);

export default routes;
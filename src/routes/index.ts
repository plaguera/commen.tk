import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { IssueController } from '../controllers/issue-controller';

const routes = Router();

routes.route("/api/user").get(UserController.get)
routes.route("/api/users/:id").get(UserController.get);
routes.route("/api/repos/:user/:repo/issues/:issuenumber/comments").get(IssueController.get);
//routes.get("/api/users/:id/repos").get(Controller.repos);
//routes.get("/api/repos/:user/:repo").get(Controller.repo);
//routes.get("/api/repos/:user/:repo/issues").get(Controller.issues);
//routes.get("/api/repos/:user/:repo/issues").post(Controller.issues);
//routes.get("/api/repos/:user/:repo/issues/:issue_number").get(Controller.issue);
//routes.get("/api/repos/:user/:repo/issues/:issuenumber/comments").get(Controller.comments);
//routes.get("/api/repos/:user/:repo/issues/:issuenumber/comments").post(Controller.comment);
//routes.get("/api/repos/:user/:repo/issues/comments/:comment_id").get(Controller.comment);
//routes.get("/api/markdown").post(Controller.markdown);
//routes.get("/authorize").get(Controller.authorize);
//routes.get("/oauth/redirect").get(Controller.access_token);

export default routes;
import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';
import { InstallationController } from './installation-controller';
import { IssueController } from './issue-controller';

export const DEFAULT_PAGE_SIZE = 10;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;

export class CommentController extends Controller {

	static async get(req: Request, res: Response) {
		let token = req.signedCookies.token ?? await InstallationController.accessToken(req.params.owner, req.params.repo);
        let pageSize = req.query.pagesize ? Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, parseInt(req.query.pagesize))) : DEFAULT_PAGE_SIZE;
		let cursor = req.query.cursor ? ', before: "' + req.query.cursor + '"' : '';
		let data = `{
			repository(name: "${req.params.repo}", owner: "${req.params.owner}") {
			createdAt
			issue(number: ${req.params.number}) {
				comments(last: ${pageSize}${cursor}) {
					pageInfo {
						startCursor
					}
					totalCount
					nodes {
						bodyHTML
						id
						authorAssociation
						author {
							avatarUrl
							login
							url
						}
						createdAt
						url
						viewerDidAuthor
					}
				}
			}
			}
		}`;
		let queryres = await query(data, token);
		CommentController.sendResponse(res, queryres.status, queryres.data)
	}

	static async post(req: Request, res: Response) {
        let token = req.signedCookies.token ?? await InstallationController.accessToken(req.params.owner, req.params.repo);
        let id = await IssueController.get(req.params.owner, req.params.repo, parseInt(req.params.number), token);
        let data = `mutation {
            __typename
            addComment(input: {subjectId: "${id.data.repository.issue.id}", body: "${req.body.body}"}) {
            clientMutationId
            }
        }`;
        let queryres = await query(data, token);
		CommentController.sendResponse(res, queryres.status, queryres.data);
	}
}

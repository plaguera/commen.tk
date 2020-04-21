import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';

export class IssueController extends Controller {
	static get(req: Request, res: Response) {
		let pageSize = req.query.pagesize ? Math.min(100, Math.max(1, req.query.pagesize)) : 10;
		let cursor = req.query.cursor ? ', before: "' + req.query.cursor + '"' : '';
		let data = `{
            repository(name: "${req.params.repo}", owner: "${req.params.user}") {
              createdAt
              issue(number: ${req.params.issuenumber}) {
                comments(last: ${pageSize}${cursor}) {
					pageInfo {
						startCursor
					}
                    totalCount
                    nodes {
                      body
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
		let token = req.signedCookies.token ?? process.env.DEFAULT_GITHUB_TOKEN;
		query(data, token).then((api) =>
			IssueController.sendResponse(res, api.status, api.data)
		);
	}

	static id(req: Request, res: Response) {
		let data = `{
            repository(name: "${req.params.repo}", owner: "${req.params.user}") {
              issue(number: ${req.params.issuenumber}) {
                id
              }
            }
          }`;
		return query(data, req.signedCookies.token);
	}

	static post(req: Request, res: Response) {
		IssueController.id(req, res).then((id) => {
			let data = `mutation {
							__typename
							addComment(input: {subjectId: "${id.data.repository.issue.id}", body: "${req.body.body}"}) {
							clientMutationId
							}
						}`;

			query(data, req.signedCookies.token).then((api) => {
				IssueController.sendResponse(res, api.status, api.data);
			});
		});
	}
}

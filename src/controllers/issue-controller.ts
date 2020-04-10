import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';

export class IssueController extends Controller {
	static get(req: Request, res: Response) {
		let data = `{
            repository(name: "${req.params.repo}", owner: "${req.params.user}") {
              createdAt
              issue(number: ${req.params.issuenumber}) {
                comments(first: 10) {
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
                    }
                }
              }
            }
          }`;
		let token = req.signedCookies.token ?? process.env.DEFAULT_GITHUB_TOKEN;
		query(data, token).then(api =>
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
		IssueController.id(req, res).then(id => {
			let data = `mutation {
							__typename
							addComment(input: {subjectId: "${id.data.repository.issue.id}", body: "${req.body.body}"}) {
							clientMutationId
							}
						}`;

			query(data, req.signedCookies.token).then(api => {
				IssueController.sendResponse(res, api.status, api.data);
			});
		});
	}
}

import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';
import { InstallationController } from './installation-controller';

export class IssueController extends Controller {
	static get(req: Request, res: Response) {
		IssueController.token(req).then(token => {
			IssueController.processIssueName(req.params.user, req.params.repo, req.params.name, token).then(() => {
				let pageSize = req.query.pagesize ? Math.min(100, Math.max(1, parseInt(req.query.pagesize))) : 10;
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
				query(data, token).then((api) =>
					IssueController.sendResponse(res, api.status, api.data)
				);
			});
		});
	}

	static async token(req: Request) {
		return req.signedCookies.token ?? await InstallationController.accessToken(req.params.user, req.params.repo);
	}
	static issueId(req: Request, res: Response) {
		let data = `{
            repository(name: "${req.params.repo}", owner: "${req.params.user}") {
              issue(number: ${req.params.issuenumber}) {
                id
              }
            }
          }`;
		return query(data, req.signedCookies.token);
	}

	static repoId(owner: string, repo: string, token:string) {
		let data = `{
            repository(name: "${repo}", owner: "${owner}") {
				id
            }
        }`;
		return query(data, token);
	}

	static post(req: Request, res: Response) {
		IssueController.issueId(req, res).then((id) => {
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

	static searchIssueName(owner: string, repo: string, name: string, token: string) {
		let data = `{
			search(query: "'${name}' in:title repo:${owner}/${repo}", type: ISSUE, last: 1) {
				issueCount
				nodes {
					... on Issue {
						id
						repository {
							id
						}
					}
				}
			}
		}`;
		return query(data, token);
	}

	static createIssue(repoid: string, name: string, token: string) {
		let data = `mutation {
						__typename
						createIssue(input: {repositoryId: "${repoid}", title: "${name}"}) {
							clientMutationId
						}
					}`;
		return query(data, token);
	}

	static async processIssueName(owner: string, repo: string, name: string, token: string) {
		let search = (await IssueController.searchIssueName(owner, repo, name, token)).data.search;
		console.log(search);
		if (search.issueCount == 0) {
			let repoId = await IssueController.repoId(owner, repo, token);
			this.createIssue(repoId.data.repository.id, name, token);
		}
	}
}

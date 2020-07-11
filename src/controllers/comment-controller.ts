import { Request, Response } from 'express';
import { Controller } from './controller';
import { IssueController } from './issue-controller';
import env from '../environment';
import { clamp } from '../util';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import log from '../logger';

export class CommentController extends Controller {

	static async get(req: Request, res: Response) {
		let pageSize = req.query.pagesize ? clamp(parseInt(<string>req.query.pagesize), env.page_size.min, env.page_size.max) : env.page_size.default;
		let cursor = req.query.cursor ? ', before: "' + req.query.cursor + '"' : '';
		let query: RequestParameters = {
			query: `query GETissueComments ($repo: String!, $owner: String!, $number: Int!, $pagesize: Int!) {
				repository(name: $repo, owner: $owner) {
					createdAt
					issue(number: $number) {
						id
						comments(last: $pagesize${cursor}) {
							pageInfo {
								startCursor
							}
							totalCount
							nodes {
								bodyHTML
								id
								authorAssociation
								author {
									avatarUrl(size: 80)
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
			}`,
			owner: req.params.owner,
			repo: req.params.repo,
			number: parseInt(req.params.issue),
			pagesize: pageSize
		};
		Controller.graphql(req, res, query);
	}

	static async post(req: Request, res: Response) {
		let id: any = req.params.issue;
		if (!isNaN(Number(id)))
			id = await IssueController.get(req, res);
		let query: RequestParameters = {
			query: `mutation POSTissueComment ($id: String!, $body: String!) {
				__typename
				addComment(input: {subjectId: $id, body: $body}) {
					clientMutationId
					commentEdge {
						node {
							id
						}
					}
				}
			}`,
			id: id,
			body: req.body.body
		};
		Controller.graphql(req, res, query);
	}

	static async delete(req: Request, res: Response) {
		let query: RequestParameters = {
			query: `mutation DELETEissueComment ($id: String!) {
				__typename
				deleteIssueComment(input: {id: $id}) {
					clientMutationId
				}
			}`,
			id: req.params.id
		};
		Controller.graphql(req, res, query);
	}
}

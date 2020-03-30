import { Request, Response } from 'express';
import { Controller } from './controller';
import { graphql } from '../request';

export class IssueController extends Controller {
	static get(req: Request, res: Response) {
		let query = `{
            repository(name: "${req.params.repo}", owner: "${req.params.user}") {
              createdAt
              issue(number: ${req.params.issuenumber}) {
                comments(first: 10) {
                    totalCount
                    nodes {
                      body
                      id
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
        graphql(query).then(api => {
            console.log(req.params.issuenumber);
			IssueController.sendResponse(res, api.status, api.data)}
		);
	}
}

export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
import log from '../logger';
const { expect } = chai;
chai.use(chaiHttp);

describe('/issues', () => {

	var server = express.listen(8002);
	var issueId = '';

	after(function () {
		server.close();
	});

	it('should create a new issue', (done) => {
        let owner = 'commen-tk';
        let repo = 'tfm-testing';
		chai.request(server)
			.post(`/issues/${owner}/${repo}`)
			.set('authorization', `token ${process.env.TESTING_GITHUB_TOKEN}`)
			.set('content-type', 'application/json')
			.send({ title: 'Issue generated during testing' })
			.end((err, res) => {
				issueId = res.body.createIssue.issue.id;
				expect(res).to.have.status(200);
				done();
			});
	});

	it('should delete an issue', (done) => {
		chai.request(server)
			.delete(`/issues/${issueId}`)
			.set('authorization', `token ${process.env.TESTING_GITHUB_TOKEN}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
	});
});
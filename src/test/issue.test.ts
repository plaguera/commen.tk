export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../environment';
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
			.set('authorization', `token ${env.github_testing_token}`)
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
			.set('authorization', `token ${env.github_testing_token}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
	});

	it('should translate an issue name to its number', (done) => {
        let owner = 'commen-tk';
		let repo = 'tfm-testing';
		let name = 'Issue #2';
		chai.request(server)
			.get(`/issues/${owner}/${repo}/${name}`)
			.set('authorization', `token ${env.github_testing_token}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('number');
				expect(res.body.number).to.equals(2);
				done();
			});
	});
});
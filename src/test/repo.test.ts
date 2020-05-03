export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
const { expect } = chai;
chai.use(chaiHttp);

describe('GET /api/comments/user/repo/issue', () => {

	var server = express.listen(8001);

	after(function () {
		server.close();
	});

	it('should get any public issue', (done) => {
        let user = 'plaguera';
        let repo = 'tfm-testing';
        let issue = 1;
		chai.request(server)
			.get(`/api/comments/${user}/${repo}/${issue}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('repository');
                expect(res.body.repository).to.have.property('createdAt');
                expect(res.body.repository).to.have.property('issue');
                expect(res.body.repository.issue).to.have.property('comments');
                expect(res.body.repository.issue.comments).to.have.property('pageInfo');
                expect(res.body.repository.issue.comments).to.have.property('totalCount');
                expect(res.body.repository.issue.comments).to.have.property('nodes');
				done();
			});
	});
});
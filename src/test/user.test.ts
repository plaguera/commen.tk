export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../environment';
import log from '../logger';
const { expect } = chai;
chai.use(chaiHttp);

describe('/users', () => {

	var server = express.listen(8000);

	after(function () {
		server.close();
	});

	it('should get a specific user', (done) => {
		let user = 'commen-tk';
		chai.request(server)
			.get(`/users/${user}`)
			.set('authorization', `token ${env.github_testing_token}`)
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('user');
				expect(res.body.user).to.have.property('login');
				expect(res.body.user).to.have.property('url');
				expect(res.body.user).to.have.property('avatarUrl');
				expect(res.body.user.login).to.equals(user);
				expect(res.body.user.url).to.equals(`https://github.com/${user}`);
				done();
			}).catch(console.error);
	});

	it('should get the viewer', (done) => {
		let viewer = 'commen-tk';
		chai.request(server)
			.get('/user')
			.set('authorization', `token ${env.github_testing_token}`)
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('viewer');
				expect(res.body.viewer).to.have.property('login');
				expect(res.body.viewer).to.have.property('url');
				expect(res.body.viewer).to.have.property('avatarUrl');
				expect(res.body.viewer.login).to.equals(viewer);
				expect(res.body.viewer.url).to.equals(`https://github.com/${viewer}`);
				done();
			}).catch(console.error);
	});
});

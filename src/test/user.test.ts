export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
const { expect } = chai;
chai.use(chaiHttp);

describe('User !', () => {

	var server = express.listen(8000);

	after(function () {
		server.close();
	});

	it('Requests for a user', (done) => {
		let user = 'plaguera';
		chai.request(server)
			.get(`/api/users/${user}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('user');
				expect(res.body.user).to.have.property('login');
				expect(res.body.user).to.have.property('url');
				expect(res.body.user).to.have.property('avatarUrl');
				expect(res.body.user.login).to.equals(user);
				expect(res.body.user.url).to.equals(`https://github.com/${user}`);
				done();
			});
	});
});

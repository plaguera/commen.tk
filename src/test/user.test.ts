export {};

import chai from 'chai';
import chaiHttp from 'chai-http';
const { expect } = chai;
chai.use(chaiHttp);

describe('Server!', () => {
	var server = require('../index');
	after(function() {
		server.close();
	});
	it("Searches for a user 'plaguera'", done => {
		chai.request(server)
			.get('/api/users/plaguera')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('data');
				expect(res.body.data).to.have.property('user');
				expect(res.body.data.user).to.have.property('login');
				expect(res.body.data.user).to.have.property('url');
        expect(res.body.data.user).to.have.property('avatarUrl');
        expect(res.body.data.user.login).to.equals('plaguera');
        expect(res.body.data.user.url).to.equals('https://github.com/plaguera');
        expect(res.body.data.user.avatarUrl).to.equals('https://avatars2.githubusercontent.com/u/22492917?u=cd106dc1a9d6a362cbf74a36a6268ede717bdc04&v=4');
				done();
			});
	});
});

export {};

require('dotenv').config();
import express from '../server' 
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../environment';
import log from '../logger';
const { expect } = chai;
chai.use(chaiHttp);

describe('/auth', () => {

	var server = express.listen(8001);

	after(function () {
		server.close();
    });
    
    it('redirects to GitHub log in page', (done) => {
		chai.request(server)
			.get('/authorize')
			.then(res => {
				expect(res).to.have.status(200);
				done();
			}).catch(console.error);
	});

	it('log out', (done) => {
		chai.request(server)
			.get('/logout')
			.then(res => {
				expect(res).to.have.status(200);
				done();
			}).catch(console.error);
	});
});
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

chai.use(chaiHttp);
chai.should();

const entryRoute = '/api/v1';

// Base Route Test
describe('Base Route Test ', () => {
	it('should return welcome to teamwork', (done) => {
		chai.request(server).get(entryRoute).end((error, response) => {
			if (error) throw Error(`Error making test request ${entryRoute}`);
			response.should.have.status(200);
			response.body.message.should.equal('welcome to teamwork');
			done();
		});
	});

	it('should return 404 for a non-found route', (done) => {
		chai.request(server).get('/badRoute').end((error, response) => {
			response.should.have.status(404);
			done();
		});
	});
});

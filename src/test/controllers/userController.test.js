import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../server';
import { UserController } from '../../controllers';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const signinRoute = '/api/v1/auth/signin';
const userRoute = '/api/v1/auth/create-user';
const getUsersRouter = '/api/v1/auth/users';
const rootUserRoute = '/api/v1/auth/create-user-root';

const { registerUser } = UserController;

describe('Users test suite', () => {
  const dummyUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    gender: 'female',
    jobRole: 'support assist',
    department: 'support',
    address: faker.address.streetAddress(),
  };
  describe('Creating User', () => {
    let adminToken;
    it('It should error for invalid request data', (done) => {
      const testUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: 'invalidMail',
        password: faker.internet.password(),
      };
      chai.request(server).post(userRoute).send(testUser).end((err, res) => {
        if (err) throw Error(`Error making test request ${route}`);
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('email');
        done();
      });
    });
    it('Should authenticate request', (done) => {
      chai.request(server).post(userRoute).send(dummyUser).end((err, res) => {
        if (err) throw Error(`Error making test request ${route}`);
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
        done();
      });
    });
    it('Should not allow none admin user', (done) => {
      const noneAdmin = {
        email: 'oliver4@gmail.com',
        password: 'password',
      };
      chai.request(server).post(signinRoute).send(noneAdmin).end((err, res) => {
        const { token } = res.body.data;
        const tokenBearer = `Bearer ${token}`;
        chai.request(server).post(userRoute).set('Authorization', tokenBearer).send(dummyUser)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.error).to.eq('Access denied, only admins');
            done();
          });
      });
    });
    it('Should allow admin user to create user', (done) => {
      const admin = {
        email: 'admin@gmail.com',
        password: 'devcAdmin',
      };
      chai.request(server).post(signinRoute).send(admin).end((err, res) => {
        const { token } = res.body.data;
        adminToken = `Bearer ${token}`;
        chai.request(server).post(userRoute).set('Authorization', adminToken).send(dummyUser)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('data');
            done();
          });
      });
    });
    it('Should allow admin get all users', (done) => {
      chai.request(server).get(getUsersRouter).set('Authorization', adminToken).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
    });
    it('Should create rootAdmin with valid secret', (done) => {
      const rootAdmin = {
        ...dummyUser,
        secret: 'root-man',
        email: faker.internet.email(),
        userRole: 'admin',
      };
      chai.request(server).post(rootUserRoute).send(rootAdmin).end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.userRole).to.eq('admin');
        done();
      });
    });
    it('Should prevent creating rootAdim with invalid secret', (done) => {
      const rootAdmin = {
        ...dummyUser,
        secret: 'unknow secret',
        userRole: 'admin',
      };
      chai.request(server).post(rootUserRoute).send(rootAdmin).end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
    });
  });
  describe('registerUser controller test', () => {
    it('Should handle error exception', async () => {
      const req = {
        body: {},
      };
      const res = { status: () => {}, json: () => {} };
      sinon.stub(res, 'status').returnsThis();
      await registerUser(req, res);
      expect(true).to.eq(true);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});

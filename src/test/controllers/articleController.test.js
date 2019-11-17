import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../server';
import { ArticleController } from '../../controllers';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const articleRoute = '/api/v1/articles';
const signinRoute = '/api/v1/auth/signin';
let bearerToken;

describe('Article test suite', () => {
  describe('creating article', () => {
    it('Should check for invalid inputs', (done) => {
      const dummyArticle = {
        title: 'Testing my airticle',
      };
      const user = {
        email: 'oliver4@gmail.com',
        password: 'password'
      };
      chai.request(server).post(signinRoute).send(user).end((_, res) => {
        const { token } = res.body.data;
        bearerToken = `Bearer ${token}`;
        chai.request(server).post(articleRoute).set('Authorization', bearerToken).send(dummyArticle)
          .end((err, arRes) => {
            if (err) throw Error('Error making request');
            expect(arRes).to.have.status(422);
            expect(arRes.body).to.have.property('errors');
            done();
          });
      });
    });
    it('Should upload article', (done) => {
      chai.request(server).post(articleRoute).set('Authorization', bearerToken)
        .field('title', 'Testing with mocha')
        .field('article', 'some long text')
        .attach('image', fs.readFileSync(path.resolve('./src/test/assets/gif1.gif')), 'gif1.gif')
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(201);
          expect(arRes.body).to.have.property('data');
          done();
        });
    });
  });
  describe('Deleting article', () => {
    it('should deleted an article with id', (done) => {
      const articleId = '9c291e0d-5183-40dc-9c8c-20be7dd70479';
      chai.request(server).delete(`${articleRoute}/${articleId}`).set('Authorization', bearerToken).end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
    it('should not deleted article belonging to another user', (done) => {
      const articleId = '59403e37-5ea7-44b0-9606-bafe179f6e05';
      chai.request(server).delete(`${articleRoute}/${articleId}`).set('Authorization', bearerToken).end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
    });
  });
  describe('Getting articles', () => {
    it('should all articles', (done) => {
      chai.request(server).get(articleRoute).set('Authorization', bearerToken).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
    });
  });
  describe('Error Catching', () => {
    const { createArticle, deleteArticle } = ArticleController;
    it('Controller should handle error', async () => {
      const req = {
        user: { userId: '11111' },
        files: { image: 'https://img.png' },
        params: { id: 'none valid id' },
        body: {
          title: 'some title'
        }
      };
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await createArticle(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
    it('Controller not add article without image', async () => {
      const req = {
        user: { userId: '11111' },
        params: { id: 'none valid id' },
        body: {
          title: 'some title'
        }
      };
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await createArticle(req, res);
      expect(res.status).to.have.been.calledWith(400);
    });
    it('Should handle error for deleteArticle', async () => {
      const req = {};
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await deleteArticle(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});

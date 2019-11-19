import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import seedArticle from '../../database/seeds/003-article';
import server from '../../server';
import { ArticleController } from '../../controllers';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const articleRoute = '/api/v1/articles';
const signinRoute = '/api/v1/auth/signin';
let bearerToken;

describe('Article test suite', () => {
  before(async () => {
    seedArticle();
  });
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
  describe('write comment for an article', () => {
    it('should add comment', (done) => {
      const payload = { comment: 'hello i love your post' };
      const id = '0a598563-5a38-4f8d-9cb7-482103559ad6';
      const route = `${articleRoute}/${id}/comment`;
      chai.request(server).post(route).set('Authorization', bearerToken)
        .send(payload)
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(201);
          expect(arRes.body).to.have.property('data');
          done();
        });
    });
    it('should not add comment for non existing postId', (done) => {
      const noExisitngId = '0a598563-5a38-4f8d-9cb7-482103559ad98';
      const route = `${articleRoute}/${noExisitngId}/comment`;
      const payload = { comment: 'hello i love your post' };
      chai.request(server).post(route).set('Authorization', bearerToken)
        .send(payload)
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(404);
          expect(arRes.body).to.have.property('error');
          done();
        });
    });
  });
  describe('editing article', () => {
    it('should edit users article', (done) => {
      const id = '0a598563-5a38-4f8d-9cb7-482103559ad6';
      const update = {
        title: 'some new title',
        article: 'some new article'
      };
      chai.request(server).patch(`${articleRoute}/${id}`).set('Authorization', bearerToken).send(update)
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(200);
          expect(arRes.body).to.have.property('data');
          done();
        });
    });
    it('should not edit article of another user', (done) => {
      const id = '59403e37-5ea7-44b0-9606-bafe179f6e05';
      const update = {
        title: 'some new title',
        article: 'some new article'
      };
      chai.request(server).patch(`${articleRoute}/${id}`).set('Authorization', bearerToken).send(update)
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(403);
          expect(arRes.body).to.have.property('error');
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
    it('Controller should catch invalid image request', async () => {
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
      expect(res.status).to.have.been.calledWith(500);
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

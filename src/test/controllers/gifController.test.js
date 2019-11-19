import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../server';
import GifController from '../../controllers/GifController';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const { deleteGif, createGif, commentGif } = GifController;

const gifRoute = '/api/v1/gifs';
const signinRoute = '/api/v1/auth/signin';
let bearerToken;
let gifId;
describe('Gif test suite', () => {
  describe('create gif', () => {
    it('Should check for gif file', (done) => {
      const dummyGif = {
        title: 'Testing my gifs',
      };
      const user = {
        email: 'oliver4@gmail.com',
        password: 'password'
      };
      chai.request(server).post(signinRoute).send(user).end((_, res) => {
        const { token } = res.body.data;
        bearerToken = `Bearer ${token}`;
        chai.request(server).post(gifRoute).set('Authorization', bearerToken).send(dummyGif)
          .end((err, gifRes) => {
            if (err) throw Error('Error making request');
            expect(gifRes).to.have.status(400);
            expect(gifRes.body).to.have.property('error');
            expect(gifRes.body.error).to.eq('Please provide an image');
            done();
          });
      });
    });
    it('Should upload gif', (done) => {
      chai.request(server).post(gifRoute).set('Authorization', bearerToken)
        .field('title', 'Testing my gifs')
        .attach('image', fs.readFileSync(path.resolve('./src/test/assets/gif1.gif')), 'gif1.gif')
        .end((err, gifRes) => {
          if (err) throw Error('Error making request');
          gifId = gifRes.body.data.id;
          expect(gifRes).to.have.status(201);
          expect(gifRes.body).to.have.property('data');
          done();
        });
    });
    describe('write comment for an gif', () => {
      it('should add comment', (done) => {
        const payload = { comment: 'hello i love your post' };
        const route = `${gifRoute}/${gifId}/comment`;
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
        const route = `${gifRoute}/${noExisitngId}/comment`;
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
  });
  describe('get all posts', () => {
    it('should get feeds', (done) => {
      const route = '/api/v1/feed';
      chai.request(server).get(route).set('Authorization', bearerToken)
        .end((err, arRes) => {
          if (err) throw Error('Error making request');
          expect(arRes).to.have.status(200);
          expect(arRes.body).to.have.property('data');
          done();
        });
    });
    it('should specific articles', (done) => {
      const route = `${gifRoute}/${gifId}`;
      chai.request(server).get(route).set('Authorization', bearerToken).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
    });
  });
  describe('delete gif', () => {
    it('should delete gif', (done) => {
      chai.request(server).delete(`${gifRoute}/${gifId}`).set('Authorization', bearerToken)
        .end((err, gifRes) => {
          if (err) throw Error('Error making request');
          expect(gifRes).to.have.status(200);
          done();
        });
    });
    it('send not found for none existing gif', (done) => {
      const dontExist = '012-20394-2039';
      chai.request(server).delete(`${gifRoute}/${dontExist}`).set('Authorization', bearerToken)
        .end((err, gifRes) => {
          if (err) throw Error('Error making request');
          expect(gifRes).to.have.status(404);
          done();
        });
    });
    it('Should handle error for deleteArticle', async () => {
      const req = {};
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await deleteGif(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
    it('Controller should catch invalid request', async () => {
      const req = {
        user: { userId: '11111' },
        body: {
          title: 'some title',
        },
        files: { image: 'none' }
      };
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await createGif(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });

    it('commentGif should catch invalid request', async () => {
      const req = {
        user: { userId: '11111' },
      };
      const res = {
        status: () => { },
        json: () => { },
      };
      sinon.stub(res, 'status').returnsThis();
      await commentGif(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import sinonChai from 'sinon-chai';
import server from '../../server';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const gifRoute = '/api/v1/gifs';
const signinRoute = '/api/v1/auth/signin';
let bearerToken;
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
          expect(gifRes).to.have.status(201);
          expect(gifRes.body).to.have.property('data');
          done();
        });
    });
  });
});

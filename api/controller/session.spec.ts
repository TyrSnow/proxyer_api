import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';

import { getRequest } from '../app.spec';

let request;

const testUserName = 'unitTestUser';
const testPassword = '123456';

describe('Test login', () => {
  before((done) => {
    request = getRequest();
    request
      .post('/api/users')
      .send({
        name: testUserName,
        password: testPassword,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return 400 when post nothing', (done) => {
    request
      .post('/api/session')
      .expect(400)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return string token', (done) => {
    request
      .post('/api/session')
      .send({
        user: testUserName,
        password: testPassword,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data).to.be.string;
        done(err);
      });
  });
});

describe('Test solveAuth', () => {
  let token;
  before((done) => {
    request = getRequest();
    request
      .post('/api/session')
      .send({
        user: testUserName,
        password: testPassword,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data).to.be.string;
        token = `Bearer ${res.body.data.token}`;
        done(err);
      });
  });

  it('should return 401 when no authorization show', (done) => {
    request
      .get('/api/session')
      .expect(401)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return user info', (done) => {
    request
      .get('/api/session')
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data).to.exist;
        expect(res.body.data.name).to.equal(testUserName);
        done(err);
      });
  });
});
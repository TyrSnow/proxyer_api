import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';
import * as mongoose from 'mongoose';

import { getRequest, getToken } from '../app.spec';
import { Server } from 'http';
import CODE from '../constants/code';

const name = 'unitTestRegist';
const password = '123456';
describe('Test regist', () => {
  let request;
  before(() => {
    request = getRequest();
  });

  it('should return 400 when post nothing', (done) => {
    request
      .post('/api/users')
      .expect(400)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });
  
  it('should return 400 when password not exist', (done) => {
    request
      .post('/api/users')
      .send({
        name: 'tianyu',
      })
      .expect(400)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return token when regist ready', (done) => {
    request
      .post('/api/users')
      .send({
        name,
        password,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return code when regist name already exist', (done) => {
    request
      .post('/api/users')
      .send({
        name,
        password,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.DUMPLICATE_NAME.code);
        done(err);
      });
  });
});

describe('Test valid name', () => {
  let request;
  before(() => {
    request = getRequest();
  });

  it('should return 400', (done) => {
    request
      .get('/api/users/names')
      .expect(400)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });

  it('should return 200', (done) => {
    request
      .get('/api/users/names?name=tianyu')
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      });
  });
});

describe('Test list user', () => {
  let request;
  let token;
  before(() => {
    request = getRequest();
    token = getToken();
  });

  it('should return auth low', (done) => {
    request
      .get('/api/users')
      .set({
        authorization: token,
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.code).to.equal(CODE.LOW_AUTHORIZE.code);
        done();
      })
  });
});

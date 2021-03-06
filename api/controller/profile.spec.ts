import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';

import { getRequest, getToken } from '../app.spec';
import CODE from '../constants/code';
import { USER_AUTH } from '../constants/user';

describe('Test normal line', () => {
  let request;
  let token;
  let adminToken;
  let profile_id;
  before(() => {
    request = getRequest();
    token = getToken();
    adminToken = getToken(USER_AUTH.ADMIN);
  });
  
  it('should not auth', (done) => {
    request
      .post('/api/profile?time=1000')
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.LOW_AUTHORIZE.code);
        done(err);
      });
  });

  it('create profile', (done) => {
    request
      .post('/api/profile?time=1000')
      .set({
        authorization: adminToken,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data).to.be.string;
        profile_id = res.body.data;
        done(err);
      })
  });

  it('test profile status', (done) => {
    request
      .get(`/api/profile?profile=${profile_id}`)
      .set({
        authorization: adminToken,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.RESOURCE_NOT_READY.code);
        done(err);
      });
  });

  it('should return profile', (done) => {
    setTimeout(() => {
      request
        .get(`/api/profile?profile=${profile_id}`)
        .set({
          authorization: adminToken,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body).to.be.string;
          done(err);
        });
    }, 1000);
  });

  it('should has no auth', (done) => {
    request
      .get(`/api/profile?profile=${profile_id}`)
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.LOW_AUTHORIZE.code);
        done(err);
      });
  });
});

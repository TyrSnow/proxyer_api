import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';

import { getRequest, getToken } from '../app.spec';
import CODE from '../constants/code';

const TEST_PROXY_NAME = 'test proxy';
let proxy_id;

describe('Test create', () => {
  let request;
  let token;
  before(() => {
    request = getRequest();
    token = getToken();
  });

  it('should return 401 when no auth', (done) => {
    request
      .post('/api/proxy')
      .expect(401)
      .end((err, res) => {
        done();
      });
  });

  it('should create proxy', (done) => {
    request
      .post('/api/proxy')
      .set({
        authorization: token,
      })
      .send({
        name: TEST_PROXY_NAME
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      })
  });

  it('should error when try to create with exist name', (done) => {
    request
      .post('/api/proxy')
      .set({
        authorization: token,
      })
      .send({
        name: TEST_PROXY_NAME
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.PROXY_NAME_EXIST.code);
        done(err);
      })
  });
});

describe('Test list and detail', () => {
  let request;
  let token;
  let list;
  before(() => {
    request = getRequest();
    token = getToken();
  });

  
  it('should has current create', (done) => {
    request
      .get('/api/proxy')
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.list).to.exist;
        list = res.body.list;
        proxy_id = list[0]._id;
        expect(res.body.page).to.exist;
        expect(res.body.list.filter(proxy => proxy.name === TEST_PROXY_NAME).length).to.equal(1);
        done(err);
      })
  });

  it('should return detail', (done) => {
    request
      .get(`/api/proxy/${list[0]._id}`)
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data._id).to.equal(list[0]._id);
        done(err);
      });
  });
});

describe('Test pattern', () => {
  let request;
  let token;
  let url;

  before((done) => {
    request = getRequest();
    token = getToken();
    request
      .get('/api/proxy')
      .set({
        authorization: token,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        proxy_id = res.body.list[0]._id;
        url = `/api/proxy/${proxy_id}/pattern`;
        done(err);
      })
  });

  it('pass unexist host', (done) => {
    request
      .post(url)
      .set({
        authorization: token,
      })
      .send({
        match: '/api',
        server: '5b1667f95b54892440710d7d'
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.HOST_NOT_EXIST.code);
        done(err);
      });
  });

  
  it('pass new host', (done) => {
    request
      .post(url)
      .set({
        authorization: token,
      })
      .send({
        match: '/api',
        server: {
          port: 888,
          ip: '127.0.0.1',
        },
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data._id).to.exist;
        done(err);
      });
  });
});

import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';

import { getRequest, getToken } from '../app.spec';
import CODE from '../constants/code';
import { proxys } from '../constants/test';

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

  it('should return 400', (done) => {
    request
      .post('/api/proxy')
      .set({
        authorization: token,
      })
      .send({
        name: TEST_PROXY_NAME
      })
      .expect(400)
      .end((err, res) => {
        expect(err).not.exist;
        done(err);
      })
  });

  it('should create proxy', (done) => {
    request
      .post('/api/proxy')
      .set({
        authorization: token,
      })
      .send({
        name: TEST_PROXY_NAME,
        port: 9010,
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
        name: TEST_PROXY_NAME,
        port: 9020,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.PROXY_NAME_EXIST.code);
        done(err);
      })
  });

  describe('test create from exist proxy', () => {
    it('should create success', () => {
      request
        .post('/api/proxy')
        .set({
          authorization: token,
        })
        .send({
          name: `${proxys[0].name}-1`,
          port: 9011,
          proxyId: proxys[0]._id,
        })
        .expect(200)
        .end((err, res) => { // 新的proxy应该包含patterns
          expect(err).not.exist;
          res.body.data.patterns.map((pattern, index) => {
            expect(pattern._id).to.equal(proxys[0].patterns[index]._id);
            expect(pattern.match).to.equal(proxys[0].patterns[index].match);
            expect(pattern.enable).to.equal(proxys[0].patterns[index].enable);
          });

          res.body.data.hosts.map((host, index) => {
            expect(host._id).not.equal(proxys[0].hosts[index]._id);
            expect(host.target).to.equal(proxys[0].hosts[index].target);
            expect(host.active).to.equal(proxys[0].hosts[index].active);
          })
        });
    });
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

describe('Test create pattern', () => {
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
        url = `/api/proxy/${proxy_id}/patterns`;
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
        server: '1'
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.HOST_NOT_EXIST.code);
        done(err);
      });
  });

  it('pass no host', (done) => {
    request
      .post(url)
      .set({
        authorization: token,
      })
      .send({
        match: '/api',
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.data._id).to.equal(proxy_id);
        done(err);
      });
  });
});

describe('test /api/proxy', () => {
  let testProxyId = proxys[0]._id;
  let testPatternId = proxys[0].patterns[0]._id;
  let testHostId = proxys[0].hosts[0]._id;
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
        url = `/api/proxy/${proxy_id}/patterns`;
        done(err);
      })
  });
  
  describe('test get pattern list', () => {
    it('should return an error', (done) => {
      request
        .get(`/api/proxy/123/patterns`)
        .set({
          authorization: token,
        })
        .expect(400)
        .end((err, res) => {
          expect(err).not.exist;
          done(err);
        });
    });

    it('should return an list', (done) => {
      request
        .get(`/api/proxy/${testProxyId}/patterns`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.data.length).exist;
          expect(res.body.data.length).to.above(0); // 至少有一个
          done(err);
        });
    })
  });

  describe('test get pattern detail', () => {
    it('should return an pattern detail', (done) => {
      request
        .get(`/api/proxy/${testProxyId}/patterns/${testPatternId}`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.data._id).to.equal(testPatternId);
          done(err);
        });
    });
  });
});


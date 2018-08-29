import { expect, assert } from 'chai';
import 'mocha';
import * as supertest from 'supertest';
import { getRequest, getToken } from '../app.spec';
import CODE from '../constants/code';

describe('Test config controller', () => {
  let request;
  let token;
  let configId;

  before(() => {
    request = getRequest();
    token = getToken();
  });

  describe('test create', () => {
    it('should get 400 when name not exist', (done) => {
      request
        .post('/api/config')
        .set({
          authorization: token,
        })
        .send({
          anything: '123',
        })
        .expect(400)
        .end((err, res) => {
          expect(err).not.exist;
          done(err);
        });
    });

    it('should return doc when create success', (done) => {
      request
        .post('/api/config')
        .set({
          authorization: token,
        })
        .send({
          name: 'test',
          value: 'test',
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.data._id).to.be.string;
          expect(res.body.data.name).to.equal('test');
          expect(res.body.data.value).to.equal('test');
          configId = res.body.data._id;
          done(err);
        });
    });

    it('should dumplicate', (done) => {
      request
      .post('/api/config')
      .set({
        authorization: token,
      })
      .send({
        name: 'test',
        value: 'test',
      })
      .expect(200)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.DUMPLICATE_FIELD.code);
        done(err);
      });
    });
  });

  describe('test query', () => {
    it('should return all when no pager params', (done) => {
      request
        .get('/api/config')
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.data).is.instanceof(Array);
          done(err);
        });
    });

    it('should return page data when pager params exist', (done) => {
      request
        .get(`/api/config?pageSize=10&page=1`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.list).is.instanceof(Array);
          expect(res.body.page.pageSize).to.equal(10);
          expect(res.body.page.page).to.equal(1);
          done(err);
        });
    });

    it('should return last page when page over limit', (done) => {
      request
        .get(`/api/config?pageSize=100&page=100`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.list).is.instanceof(Array);
          expect(res.body.page.pageSize).to.equal(100);
          expect(res.body.page.page).to.equal(1);
          done(err);
        });
    });
  });

  describe('test get detail', () => {
    it('should get 404', (done) => {
      request
      .get(`/api/config/5b7a3a2dfb102e03bcbfbf02`)
      .set({
        authorization: token,
      })
      .expect(404)
      .end((err, res) => {
        expect(err).not.exist;
        expect(res.body.code).to.equal(CODE.DOC_NOT_EXIST.code);
        done(err);
      });
    });

    it('should return doc', (done) => {
      request
        .get(`/api/config/${configId}`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.data._id).to.equal(configId);
          expect(res.body.data.name).to.equal('test');
          expect(res.body.data.value).to.equal('test');
          done(err);
        });
    });
  });

  describe('test delete', () => {
    it('should delete success', (done) => {
      request
        .delete(`/api/config/${configId}`)
        .set({
          authorization: token,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.success).to.equal(true);
          done(err);
        });
    });

    it('delete again should get 404', (done) => {
      request
        .delete(`/api/config/${configId}`)
        .set({
          authorization: token,
        })
        .expect(404)
        .end((err, res) => {
          expect(err).not.exist;
          expect(res.body.code).to.equal(CODE.DOC_NOT_EXIST.code);
          done(err);
        });
    });
  });
});

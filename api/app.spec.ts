/**
 * 这边统一生成一个request，不用个controller都生成了
 */
import { expect, assert } from 'chai';
import * as supertest from 'supertest';
import * as mongoose from 'mongoose';
import App from './app';
import { Server } from 'http';

const port = process.env.TEST_ENV_PORT || 4000;

let server: Server;
let request;
let token;
let name = 'unitTest';
let password = '123456';

function createTestEnv(done) {
  request
    .post('/api/users')
    .send({
      name,
      password,
    })
    .expect(200)
    .end((err, res) => {
      expect(err).not.exist;
      token = `Bearer ${res.body.data.token}`;
      done(err);
    });
}

before((done) => {
  let app = new App();
  app.init();
  request = supertest.agent(app.app);
  createTestEnv(done);
  // server = app.listen(port, (err) => {
  //   if (err) {
  //     done(err);
  //     return;
  //   }
  //   console.log(server);
  //   request = supertest.agent(server);
  //   createTestEnv(done);
  // });
});

after((done) => {
  console.log('All test specs complete');
  // server.close(() => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        console.log('Env cleared');
        done();
      });
    });
  // });
});

export function getRequest() {
  return request;
}

export function getToken() {
  return token;
}

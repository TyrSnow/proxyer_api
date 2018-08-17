/**
 * 这边统一生成一个request，不用个controller都生成了
 */
import { expect, assert } from 'chai';
import * as supertest from 'supertest';
import * as mongoose from 'mongoose';
import App from './app';
import { Server } from 'http';
import { users } from './constants/test';
import { USER_AUTH } from './constants/user';

const port = process.env.TEST_ENV_PORT || 4000;
console.log(process.env);
let server: Server;
let request;
let token;
let name = 'unitTest';
let password = '123456';
let authTokens = [];

function login(user: string, password: string, key: string) {
  return new Promise((resolve, reject) => {
    request
      .post('/api/session')
      .send({
        user,
        password,
        remember: true,
      })
      .expect(200)
      .end((err, res) => {
        let token = `Bearer ${res.body.data.token}`;
        authTokens[key] = token;
        resolve(token);
      });
  });
}

function initUserToken() {
  const promises = [];
  for (let key in users) {
    const { username, password } = users[key];
    promises.push(login(username, password, key));
  }
  return Promise.all(promises);
}
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
  initUserToken().then(() => {
    createTestEnv(done);
  });
});

after((done) => {
  console.log('All test specs complete');
  mongoose.connection.db.dropDatabase(() => {
    mongoose.disconnect(() => {
      console.log('Env cleared');
      done();
    });
  });
});

export function getRequest() {
  return request;
}

export function getToken(auth?: USER_AUTH) {
  if (auth) {
    return authTokens[auth] || token;
  }
  return token;
}

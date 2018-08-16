import {USER_AUTH} from "./user";

export const users = {
  [USER_AUTH.USER]: {
    username: 'test_user',
    password: '123456'
  },
  [USER_AUTH.ADMIN]: {
    username: 'test_admin',
    password: '123456'
  },
  [USER_AUTH.ROOT]: {
    username: 'test_root',
    password: '123456'
  }
}

export const proxys = [
  {
    "_id": "5b7545201a65e811d04b5f1e",
    "name": "test_project_0",
    "port": 9000,
    "creator": "5b7544da1a65e811d04b5f1b",
    "patterns": [
      {
        "allow_methods": [],
        "throttle": 0,
        "sort": -1,
        "enable": true,
        "pause": false,
        "_id": "5b75456e1a65e811d04b5f21",
        "handle": 0,
        "match": "/api",
        "server": null
      }
    ],
    "hosts": [
      {
        "_id": "5b7545561a65e811d04b5f20",
        "target": "127.0.0.1:8080",
        "name": "test_host_0",
        "changeOrigin": true,
        "active": true
      }
    ],
  }, {
    "_id" : "5b7545311a65e811d04b5f1f",
    "name" : "test_project_1",
    "port" : 9001,
    "creator" : "5b7544da1a65e811d04b5f1b",
    "patterns" : [],
    "hosts" : [],
  }
];

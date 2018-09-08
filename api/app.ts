import * as express from 'express';
import * as log4js from 'log4js';
import * as bodyParser from 'body-parser';
import { Application } from './core';

import './start';
import time from './middleware/time';


const logger = log4js.getLogger('default');
const debug = log4js.getLogger('debug');

class App extends Application {
  private middlewares = [
    time,
    log4js.connectLogger(logger, {
      level: 'auto',
      format: ':method :url',
    }),
    bodyParser.json({ limit: '5mb' }),
    bodyParser.urlencoded({ extended: true }),
  ];

  private errors = [
    function (err, req, res, next) {
      if (err.status === 401) { // 权限问题
        return res.status(401).json({
          message: err.message,
        });
      }
    
      this.error.error(JSON.stringify(err));
      res.status(500).send({
        message: 'Unrecognized Error',
      });
    }
  ];
}

export default App;

import * as express from 'express';
import * as log4js from 'log4js';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import './start';
import controllerLoader from './core/loader/controller';

class App {
  public app = express();
  public logger = log4js.getLogger('default');
  public debug = log4js.getLogger('debug');
  constructor() {
    this.init_third_party();
    this.calc_time();
    this.load_routes();
    this.load_error_handle();
  }

  init_third_party() {
    this.use(log4js.connectLogger(this.logger, {
      level: 'auto',
      format: ':method :url',
    }));
    
    // 处理参数
    this.use(bodyParser.json({ limit: '5mb' }));
    this.use(bodyParser.urlencoded({ extended: true }));
  }

  calc_time() { // 计算时间
    this.use((req, res, next) => {
      const startTime = new Date().valueOf(); // 获取时间 t1
    
      const calResponseTime = () => {
        const now = new Date().valueOf(); //获取时间 t2
        const deltaTime = now - startTime;
        this.debug.debug(`[Debug]Request path: ${req.originalUrl}, cost: ${deltaTime}`);
      }
    
      res.once('finish', calResponseTime);
      res.once('close', calResponseTime);
      next();
    });
  }

  load_routes() {
    let routes = controllerLoader();
    this.use('/api', routes);
  }

  load_error_handle() {
    this.use(function (err, req, res, next) {
      if (err.status === 401) { // 权限问题
        return res.status(401).json({
          message: err.message,
        });
      }
    
      this.error.error(JSON.stringify(err));
      res.status(500).send({
        message: 'Unrecognized Error',
      });
    });
  }
  
  use(...args) {
    return this.app.use.apply(this.app, args);
  }

  listen(...args) {
    return this.app.listen.apply(this.app, args);
  }
}

export default App;

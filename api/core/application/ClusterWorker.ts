import * as express from 'express';
import controllerLoader from '../controller/loader';
import * as log4js from 'log4js';

const logger = log4js.getLogger('default');

export class ClusterWorker {
  static defaultConfig = {
    controllerPath: 'api/controller',
    agentPath: 'api/agent',
    prefix: '/api',
  };

  private middlewares: any[] = [];
  private errors: any[] = [];
  private app = express();
  private config: any;

  constructor(
    config,
  ) {
    this.config = Object.assign({}, ClusterWorker.defaultConfig, config);
  }
  
  getOrigin() {
    return this.app;
  }

  use(...args) {
    return this.app.use.apply(this.app, args);
  }
  
  init() {
    // 加载中间件
    this.middlewares.map(middleware => this.use(middleware));
    
    // 加载路由
    const route = controllerLoader(this.config.controllerPath);
    if (this.config.prefix) {
      this.use(this.config.prefix, route);
    } else {
      this.use(route);
    }

    // 错误处理
    this.errors.map(errorHandler => this.use(errorHandler));
  }

  listen(...args) {
    this.init();
    return this.app.listen.apply(this.app, args);
  }
}

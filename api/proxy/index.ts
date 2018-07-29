import { ProxyModel } from "../models/Proxy/index.d";
import { fork, ChildProcess } from 'child_process';
import { PROXY_STATUS } from "../constants/proxy";
import CODE from "../constants/code";

export default class ProxyNode {
  static generate_proxy_argv(proxy: ProxyModel.Proxy) {
    return ['-p', proxy.port.toString()];
  }
  
  static validate_start_env(proxy: ProxyModel.Proxy) {

  }

  private node: ChildProcess;
  
  public status: PROXY_STATUS = PROXY_STATUS.STOP;

  constructor(
    private proxy: ProxyModel.Proxy,
  ) {}
  
  start() {
    return new Promise((resolve, reject) => {
      let resolved = false;
    
      this.node = fork('api/proxy/server', ProxyNode.generate_proxy_argv(this.proxy));
      this.node.on('exit', (code) => {
        console.debug('Proxy node exit: ', code);
        this.node.removeAllListeners();
        this.status = code === 0 ? PROXY_STATUS.STOP : PROXY_STATUS.ERROR;
        if (resolved) {
          reject(CODE.PROXY_START_ERROR);
        }
      });

      this.node.on('message', (message) => {
        console.debug('Receive message: ', message);
        if (typeof message === 'string') {
          switch(message) {
            case 'START_SUCCESS':
              this.node.send(this.proxy);
              break;
            case 'PROXY_READY':
              this.status = PROXY_STATUS.RUNNING;
              resolved = true;
              resolve(this.status);
              break;
            default:
              console.log('Unknow message: ', message);
          }
          return;
        }
        // 更新日志
        
      });
    });
  }
  
  update_config(config: ProxyModel.Proxy) {
    return this.send(JSON.stringify(config));
  }

  restart(proxy: ProxyModel.Proxy) {
    this.status = PROXY_STATUS.RESTARTING;
    return this.stop().then(() => {
      this.proxy = proxy;
      return this.start();
    });
  }
  
  stop() {
    return new Promise((resolve, reject) => {
      this.node.send('STOP', (error) => {
        if (error) {
          return reject(error);
        }
        let interval = setInterval(() => {
          if (this.status === PROXY_STATUS.STOP) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    });
  }

  send(message) {
    return new Promise((resolve, reject) => {
      this.node.send(message, () => {
        resolve();
      });
    });
  }
}
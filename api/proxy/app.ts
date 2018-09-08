/// <reference path="./index.d.ts" />
import * as http from 'http';
import { ProxyModel } from '../models/Proxy/index.d';
import * as url from 'url';
import ProxyRequest from './Request';
import { METHOD_MAP } from '../constants/http';

export default class App {
  static generate_match_reg(match: string) {
    return new RegExp(match);
  }

  private server: http.Server
  private patterns: ProxyModel.PatternModel[];
  private hosts: HostOption[];
  private hostMap: Map<string, HostOption> = new Map();
  private default_host: HostOption;
  private port: number;
  private requests: ProxyRequest[] = [];
  private requestMap: Map<string, ProxyRequest> = new Map();

  constructor() {
  }
  
  /**
   * 更新代理配置
   */
  set_config(config: ProxyModel.Proxy) {
    // 清理未激活的，并按照sort值排序，最后将match换成正则表达式
    this.patterns = config.patterns.filter(pattern => pattern.enable).sort((pre, after) => (
      pre.sort > after.sort ? -1 : 0
    )).map(pattern => {
      pattern.match = App.generate_match_reg(pattern.match as string);
      if (pattern.allow_methods && pattern.allow_methods.length === 0) {
        delete pattern.allow_methods;
      }
      return pattern;
    });

    // 补充host的protocal，并解析host的target
    this.hosts = config.hosts.map(host => {
      let { target, changeOrigin } = host;
      if (!target.match(/^https?/)) {
        if (target.match(/^\/\//)) {
          target = 'http:' + target;
        } else {
          target = 'http://' + target;
        }
      }

      let { protocol, hostname, port, path} = url.parse(target);

      let hostOption = {
        hostname,
        port,
        path,
        changeOrigin,
        protocol,
      };

      this.hostMap.set(host._id, hostOption);
      return hostOption;
    });

    // 单独记录默认host 
    this.default_host = this.hostMap.get(config.hosts.find(host => host.active)._id);
  }
  
  /**
   * 匹配请求对应的模式
   */
  match_request_pattern(req: Request) {
    return this.patterns.find(pattern => {
      if (pattern.allow_methods) {
        if (pattern.allow_methods.indexOf(METHOD_MAP[req.method]) === -1) {
          return false;
        }
      }
      return !!req.url.match(pattern.match);
    });
  }

  handle_request(req, res) {
    let pattern = this.match_request_pattern(req);
    let host;
    if (pattern && pattern.server) {
      host = this.hostMap.get(<string>pattern.server);
    } else {
      host = this.default_host;
    }
    let request = new ProxyRequest(req, res, host, pattern);
    this.requestMap.set(request.id, request);
    this.requests.push(request);
  }
  
  resume(payload) {
    let { id } = payload;
    let request = this.requestMap.get(id);
    request.proxy();
  }
  
  block(payload) {
    // let { id, status } = payload;
    // let request = this.requestMap.get(id);
    // request.block(status);
  }

  listen(port) {
    this.port = port;
    this.server = http.createServer()
      .on('request', this.handle_request.bind(this))
      .listen(port, '0.0.0.0', (err) => {
        if (err) {
          console.error('proxy start error: ', err);
          process.exit(1);
          return;
        }
        process.send('START_SUCCESS');
      });
  }
}

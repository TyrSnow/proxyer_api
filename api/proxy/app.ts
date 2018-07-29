/// <reference path="./index.d.ts" />
import * as http from 'http';
import { ProxyModel } from '../models/Proxy/index.d';
import * as url from 'url';
import ProxyRequest from './Request';

export default class App {
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
  
  set_config(config: ProxyModel.Proxy) {
    this.patterns = config.patterns.filter(pattern => pattern.enable).map(pattern => {
      pattern.match = new RegExp(pattern.match);
      return pattern;
    });
    this.hosts = config.hosts.map(host => {
      let { target, changeOrigin } = host;
      if (!target.match(/^https?/)) {
        if (target.match(/^\/\//)) {
          target = 'http:' + target;
        } else {
          target = 'http://' + target;
        }
      }

      let { hostname, port, path} = url.parse(target);

      let hostOption = {
        hostname,
        port,
        path,
        changeOrigin,
      };

      this.hostMap.set(host._id, hostOption);
      return hostOption;
    });
    this.default_host = this.hostMap.get(config.hosts.find(host => host.active)._id);
  }

  match_request_pattern(req: Request) {
    return this.patterns.find(pattern => {
      if (pattern.mathods) {
        if (!(req.method in pattern.mathods)) {
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
    let { id, status } = payload;
    let request = this.requestMap.get(id);
    request.block(status);
  }

  listen(port) {
    this.port = port;
    this.server = http.createServer()
      .on('request', this.handle_request.bind(this))
      .listen(port, '0.0.0.0', (err) => {
        if (err) {
          process.exit(1);
          return;
        }
        process.send('START_SUCCESS');
      });
  }
}

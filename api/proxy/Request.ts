/// <reference path="./index.d.ts" />
import * as url from 'url';
import * as http from 'http';
import { ObjectId } from 'bson';
import { Throttle } from 'stream-throttle';
import { ProxyModel } from "../models/Proxy/index.d";
import { PATTERN_THROTTLE_TYPE } from '../constants/proxy';
import { METHOD_MAP } from '../constants/http';

/**
 * 链接记录
 */
class ProxyRequest {
  static get_client_ip(req: any) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip;
  }

  static combine_path(path: string, host: HostOption) {
    return path;
  }

  static change_origin(option: any, host: HostOption) {
    if (host.changeOrigin) {
      option.headers.host = host.hostname;
      return option;
    }
    return option;
  }

  public id: string = new ObjectId().toHexString();
  private path: string;
  private pathname: string;
  private clientIp: string;
  private query: string;
  private finished: boolean = false;
  private requestContent: string = '';
  private responseContent: string = '';
  private responseHeaders: any;
  private startTime: number;
  private cost: number;

  constructor(
    private req: any,
    private res: any,
    private host: HostOption,
    private pattern?: ProxyModel.PatternModel,
  ) {
    let { path, pathname, query } = url.parse(req.url);
    this.path = path;
    this.pathname = pathname;
    this.query = query;
    this.startTime = new Date().valueOf();
    this.clientIp = ProxyRequest.get_client_ip(req);

    process.send(this.toJSON());
    if (!pattern || (pattern.throttle !== PATTERN_THROTTLE_TYPE.PAUSE)) {
      this.proxy(pattern);
    }
  }
  
  proxy_https() {

  }

  proxy(pattern: ProxyModel.PatternBase = {}) {
    let { host }= this;
    let { method, headers, hostname } = this.req;
    let option = ProxyRequest.change_origin({
      method,
      headers: Object.assign({}, headers),
      path: ProxyRequest.combine_path(this.path, host),
      hostname: host.hostname,
      port: host.port,
    }, host);

    // console.log('Proxy to: ', option, ' with pattern: ', pattern);
    let nReq = http.request(option, (nRes) => {
      this.responseHeaders = nRes.headers;
      this.res.writeHead(nRes.statusCode, nRes.headers);
      if (pattern.throttle === PATTERN_THROTTLE_TYPE.SPEED) {
        nRes.pipe(new Throttle({ rate: pattern.speed * 1024 })).on('end', () => {
          console.log('finished.');
          this.finished = true;
          this.cost = new Date().valueOf() - this.startTime;
          process.send(this.toJSON());
        }).pipe(this.res);
      } else {
        nRes.on('end', () => {
          console.log('finished.');
          this.finished = true;
          this.cost = new Date().valueOf() - this.startTime;
          process.send(this.toJSON());
        }).pipe(this.res);
      }

      nRes.on('data', (data) => {
        this.responseContent+= data;
      });
    }).on('error', (e) => {
      console.log('request error: ', e);
      this.res.end();
    });

    if (pattern.throttle === PATTERN_THROTTLE_TYPE.SPEED) {
      this.req.on('data', (data) => {
        this.requestContent+= data;
      }).pipe(new Throttle({ rate: pattern.speed * 1024 })).pipe(nReq);
    } else if (pattern.throttle === PATTERN_THROTTLE_TYPE.DELAY) {
      setTimeout(() => {
        this.req.on('data', (data) => {
          this.requestContent+= data;
        }).pipe(nReq);
      }, pattern.delay * 1000);
    } else if (pattern.throttle === PATTERN_THROTTLE_TYPE.DELAY_BLOCK) {
      setTimeout(() => {
        this.res.writeHead(500);
        this.res.end();
        this.finished = true;
        process.send(this.toJSON());
      }, pattern.delay * 1000);
    } else {
      this.req.on('data', (data) => {
        this.requestContent+= data;
      }).pipe(nReq);
    }
  }

  block(status: string) {
    this.res.writeHead(status);
    this.res.end();
  }

  toJSON() {
    return {
      _id: this.id,
      url: this.pathname,
      query: this.query,
      clientIp: this.clientIp,
      method: METHOD_MAP[this.req.method],
      headers: this.req.headers,
      finished: this.finished,
      status: this.res.statusCode,
      cost: this.cost,
      responseContent: this.responseContent,
      responseHeaders: this.responseHeaders,
      requestContent: this.requestContent,
      pattern: this.pattern ? this.pattern._id : undefined,
    };
  }
}

export default ProxyRequest;

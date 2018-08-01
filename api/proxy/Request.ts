/// <reference path="./index.d.ts" />
import * as url from 'url';
import * as http from 'http';
import { ObjectId } from 'bson';
import { Throttle } from 'stream-throttle';
import { ProxyModel } from "../models/Proxy/index.d";
import { PATTERN_THROTTLE_TYPE } from '../constants/proxy';

/**
 * 链接记录
 */
class ProxyRequest {
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

  constructor(
    private req: any,
    private res: any,
    private host: HostOption,
    private pattern?: ProxyModel.PatternModel,
  ) {
    let { path } = url.parse(req.url);
    this.path = path;
    if (!pattern || (pattern.throttle !== PATTERN_THROTTLE_TYPE.PAUSE)) {
      this.proxy(pattern);
    }
    process.send(this.toJSON());
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
      this.res.writeHead(nRes.statusCode, nRes.headers);
      if (pattern.throttle === PATTERN_THROTTLE_TYPE.SPEED) {
        nRes.pipe(new Throttle({ rate: pattern.speed })).pipe(this.res);
      } else {
        nRes.pipe(this.res);
      }
    }).on('error', (e) => {
      console.log('request error: ', e);
      this.res.end();
    });

    if (pattern.throttle === PATTERN_THROTTLE_TYPE.SPEED) {
      this.req.pipe(new Throttle({ rate: pattern.speed })).pipe(nReq);
    } else if (pattern.throttle === PATTERN_THROTTLE_TYPE.DELAY) {
      setTimeout(() => {
        this.req.pipe(nReq);
      }, pattern.delay * 1000);
    } else if (pattern.throttle === PATTERN_THROTTLE_TYPE.DELAY_BLOCK) {
      setTimeout(() => {
        this.res.writeHead(500);
        this.res.end();
      }, pattern.delay * 1000);
    } else {
      this.req.pipe(nReq);
    }
  }

  block(status: string) {
    this.res.writeHead(status);
    this.res.end();
  }

  is_finished() {
    return this.req.finished;
  }

  toJSON() {
    return {
      id: this.id,
      path: this.path,
      status: this.res.statusCode,
      matched: this.pattern ? this.pattern._id : undefined,
    };
  }
}

export default ProxyRequest;

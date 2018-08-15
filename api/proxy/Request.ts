/// <reference path="./index.d.ts" />
import * as url from 'url';
import * as http from 'http';
import { ObjectId } from 'bson';
import { Throttle } from 'stream-throttle';
import * as queryString from 'query-string';
import { ProxyModel } from "../models/Proxy/index.d";
import { PATTERN_THROTTLE_TYPE, PATTERN_HANDLE_TYPE, PATTERN_MOCK_TYPE } from '../constants/proxy';
import { METHOD_MAP } from '../constants/http';

const CONTENT_TYPE_MAP = {
  [PATTERN_MOCK_TYPE.JSON]: 'application/json;charset=UTF-8',
  [PATTERN_MOCK_TYPE.TEXT]: 'text/plain;charset=UTF-8',
  [PATTERN_MOCK_TYPE.JS]: 'application/javascript;charset=UTF-8',
  [PATTERN_MOCK_TYPE.JSONP]: 'application/javascript;charset=UTF-8',
  [PATTERN_MOCK_TYPE.HTML]: 'text/html;charset=UTF-8',
};

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

  static get_mock_headers(mock_type: PATTERN_MOCK_TYPE, mock_content: string = '') {
    let header = {
      'content-length': Buffer.byteLength(mock_content),
      'content-type': CONTENT_TYPE_MAP[mock_type] || CONTENT_TYPE_MAP[PATTERN_MOCK_TYPE.TEXT],
    };
    return header;
  }

  public id: string = new ObjectId().toHexString();
  private path: string;
  private pathname: string;
  private realPath: string;
  private realHostname: string;
  private realPort: string;
  private clientIp: string;
  private query: string;
  private params: object;
  private finished: boolean = false;
  private mock: boolean;
  private requestContent: string = '';
  private responseContent: string = '';
  private responseHeaders: any;
  private startTime: number;
  private cost: number;

  constructor(
    private req: any,
    private res: any,
    private host: HostOption,
    private pattern: ProxyModel.PatternBase = { _id: '-1' },
  ) {
    let { path, pathname, query } = url.parse(req.url);
    this.path = path;
    this.pathname = pathname;
    this.query = query;
    this.params = queryString.parse(query);
    this.startTime = new Date().valueOf();
    this.clientIp = ProxyRequest.get_client_ip(req);
    this.realPath = ProxyRequest.combine_path(this.path, host);
    this.realHostname = host.hostname;
    this.realPort = host.port;

    this.log();

    this.throttle();
  }
  
  throttle_speed() {
    let reqThrottle = new Throttle({ rate: this.pattern.speed * 1024 });
    let resThrottle = new Throttle({ rate: this.pattern.speed * 1024 });

    return this.proxy(
      this.req.pipe(reqThrottle),
      resThrottle.pipe(this.res),
    );
  }
  
  throttle_delay() {
    setTimeout(() => {
      this.proxy();
    }, this.pattern.delay * 1000);
  }

  throttle() {
    if (this.pattern) {
      if (this.pattern.throttle === PATTERN_THROTTLE_TYPE.DELAY) {
        return this.throttle_delay();
      } else if (this.pattern.throttle === PATTERN_THROTTLE_TYPE.SPEED) {
        return this.throttle_speed();
      }
    }
    return this.proxy();
  }
  
  proxy_end() {
    this.finished = true;
    this.cost = new Date().valueOf() - this.startTime;
    this.log();
  }

  proxy_block(req, res) {
    const {
      mock_type, mock_status,
    } = this.pattern;
    this.responseHeaders = ProxyRequest.get_mock_headers(mock_type);
    req.on('data', (data) => {
      this.requestContent+= data;
    }).on('end', () => {
      res.writeHead(mock_status, this.responseHeaders);
      res.end();
      this.proxy_end();
    });
  }

  proxy_mock(req, res) {
    const {
      mock_type, mock_status, mock_content,
    } = this.pattern;
    this.responseHeaders = ProxyRequest.get_mock_headers(mock_type, mock_content);
    req.on('data', (data) => {
      this.requestContent+= data;
    }).on('end', () => {
      res.writeHead(mock_status, this.responseHeaders);
      res.write(mock_content);
      res.end();
      this.responseContent = mock_content;
      this.proxy_end();
    });
  }

  proxy_through(req, res) {
    let { pattern } = this;
    let { host }= this;
    let { method, headers, hostname } = this.req;
    let option = ProxyRequest.change_origin({
      method,
      headers: Object.assign({}, headers),
      path: this.realPath,
      hostname: this.realHostname,
      port: this.realPort,
    }, host);

    let nReq = http.request(option, (nRes) => {
      this.responseHeaders = nRes.headers;
      this.res.writeHead(nRes.statusCode, nRes.headers);
      nRes.on('data', (data) => {
        this.responseContent+= data;
      }).on('end', () => {
        this.proxy_end();
      }).on('error', () => {
        this.proxy_end();
      }).pipe(res);
    }).on('error', (e) => {
      this.res.end();
    });

    req.on('data', (data) => {
      this.requestContent+= data;
    }).pipe(nReq);
  }

  proxy(req = this.req, res = this.res) {
    if (this.pattern.handle) {
      if (this.pattern.handle === PATTERN_HANDLE_TYPE.MOCK) {
        this.mock = true;
        return this.proxy_mock(req, res);
      } else if (this.pattern.handle === PATTERN_HANDLE_TYPE.BLOCK) {
        this.mock = true;
        return this.proxy_block(req, res);
      }
    }
    return this.proxy_through(req, res);
  }
  
  log() {
    process.send(this.toJSON());
  }

  toJSON() {
    return {
      _id: this.id,
      url: this.pathname,
      realPath: this.realPath,
      realHostname: this.realHostname,
      realPort: this.realPort,
      query: this.query,
      params: this.params,
      clientIp: this.clientIp,
      method: METHOD_MAP[this.req.method],
      headers: this.req.headers,
      mock: this.mock,
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

import * as http from 'http';
import * as net from 'net';
import * as url from 'url';
import { ProxyModel } from '../models/Proxy/index.d';

/**
 * 代理服务器
 */
class ProxyServer {
  private server = http.createServer();
  private requests = [];
  constructor(
    private config: ProxyModel.Proxy
  ) {
  }

  update_config(config: ProxyModel.Proxy) {
    this.config = config;
  }
  
  // 获得某个时间点之后的请求日志
  get_request_after_time(afterTime: number) {

  }
  
  // 获得某个请求之后的请求日志
  get_request_after_id(afterId: string) {

  }

  handleRequest(req, res) {
    // 构建一个Request对象，并记录到requests里

  }
  
  handleConnect(req, sock) {

  }

  start() {

  }

  pause() {

  }

  stop() {

  }
}
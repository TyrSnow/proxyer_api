import { service } from "../core/injector";
import { ProxyModel } from "../models/Proxy/index.d";
import ProxyNode from '../proxy/index';
import CODE from "../constants/code";
import { PROXY_STATUS } from "../constants/proxy";

@service()
class ProxyServerService {
  private servers: Map<string, ProxyNode> = new Map();

  start(
    proxy_id: string,
    proxy: ProxyModel.Proxy
  ) {
    let server = this.servers.get(proxy_id);
    if (!server) {
      server = new ProxyNode(proxy);
      this.servers.set(proxy_id, server);
      return server.start();
    }
    
    return Promise.resolve(server.status);
  }

  stop(
    proxy_id: string,
  ) {
    return new Promise((resolve, reject) => {
      let server = this.servers.get(proxy_id);
      if (server) {
        server.stop().then(() => {
          this.servers.delete(proxy_id);
          resolve(PROXY_STATUS.STOP);
        }).catch((err) => {
          reject(server.status);
        });
      } else {
        reject(CODE.PROXY_NOT_START);
      }
    });
  }
  
  update_config(
    proxy_id: string,
    config: ProxyModel.Proxy,
  ) {
    console.debug('Will update config: ', proxy_id);
    let server = this.servers.get(proxy_id);
    if (server) {
      return server.update_config(config);
    }
    // return Promise.reject(CODE.PROXY_NOT_START);
    return Promise.resolve(CODE.SUCCESS);
  }

  restart(
    proxy_id: string,
    proxy: ProxyModel.Proxy,
  ) {
    let server = this.servers.get(proxy_id);
    if (server) {
      return server.restart(proxy);
    }
    return this.start(proxy_id, proxy);
  }

  status(
    proxy_id: string,
  ) {
    return Promise.resolve(this.syncStatus(proxy_id));
  }

  syncStatus(
    proxy_id: string,
  ): PROXY_STATUS {
    let server = this.servers.get(proxy_id);
    if (server) {
      return server.status;
    }
    return PROXY_STATUS.STOP;
  }
}

export default ProxyServerService;

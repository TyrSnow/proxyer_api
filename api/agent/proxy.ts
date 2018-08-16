import { agent } from "../core";
import ProxyNode from "../proxy";
import ProxyService from "../service/proxy";
import { PROXY_STATUS } from "../constants/proxy";
import { ProxyModel } from "../models/Proxy/index.d";
import RequestLogger from "../service/request.logger";
import CODE from "../constants/code";

@agent()
class ProxyAgent {
  private servers: Map<string, ProxyNode> = new Map();
  constructor(
    private logger: RequestLogger,
  ) {}

  start(
    proxy_id: string,
    proxy: ProxyModel.Proxy
  ) {
    let server = this.servers.get(proxy_id);
    if (
      (!server) ||
      (server.status === PROXY_STATUS.ERROR) ||
      (server.status === PROXY_STATUS.STOP)
    ) {
      server = new ProxyNode(proxy, this.logger);
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
      if (
        (server.status !== PROXY_STATUS.ERROR) &&
        (server.status !== PROXY_STATUS.STOP)
      ) {
        return server.update_config(config);
      }
    }

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

  private syncStatus(
    proxy_id: string,
  ): PROXY_STATUS {
    let server = this.servers.get(proxy_id);
    if (server) {
      return server.status;
    }
    return PROXY_STATUS.STOP;
  }

  status(
    proxy_id: string,
  ) {
    return Promise.resolve(this.syncStatus(proxy_id));
  }
}

export default ProxyAgent;

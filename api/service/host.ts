import { service } from "../core/injector";
import { create } from "./../core/injector/factor";
import ProxyService from "./proxy";
import Proxy from '../models/Proxy';
import { ProxyModel } from "../models/Proxy/index.d";
import mask_object from "../tools/maskObject";
import update_sub_doc from "../tools/update_sub_doc";
import CODE from "../constants/code";
import ProxyServerService from "./proxy.server";

@service()
class HostService {
  constructor(
    private proxyService: ProxyService,
    private serverService: ProxyServerService,
  ) {}
  
  private get_proxy_by_host(
    host_id: string,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id);
    }
    return this.proxyService.query_selective({
      'hosts._id': host_id,
    });
  }
  
  private get_host_from_proxy(
    proxy: ProxyModel.Proxy,
    host_id: string,
  ) {
    return proxy.hosts.id(host_id);
  }

  list(
    proxy_id: string,
  ) {
    return this.proxyService.get_selective(proxy_id).then(proxy => {
      return Promise.resolve(proxy.hosts);
    });
  }

  get_seletive(
    host_id: string,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id).then(proxy => {
        return this.get_host_from_proxy(proxy, host_id);
      });
    }
    return this.get_proxy_by_host(host_id).then(proxy => {
      return this.get_host_from_proxy(proxy, host_id);
    });
  }
  
  update_proxy_host(
    proxy: ProxyModel.Proxy,
    host_id: string,
    data: object,
  ) {
    let host = proxy.hosts.id(host_id);
    update_sub_doc(host, data, ['name', 'target', 'changeOrigin']);
    return proxy.save().then(proxy => {
      this.serverService.update_config(proxy._id.toHexString(), proxy);
      return this.get_host_from_proxy(proxy, host_id);
    });
  }

  update_host(
    host_id: string,
    data: object,
    proxy_id?: string,
  ) {
    return this.get_proxy_by_host(host_id, proxy_id).then(proxy => {
      return this.update_proxy_host(proxy, host_id, data);
    });
  }
  
  update_host_enable(
    host_id: string,
    enable: boolean,
    proxy_id?: string,
  ) {
    return this.get_proxy_by_host(host_id, proxy_id).then(proxy => {
      let host = proxy.hosts.id(host_id);
      host.set('disable', enable ? undefined : true);
      return proxy.save({
        safe: true,
      }).then(proxy => {
        return this.get_host_from_proxy(proxy, host_id);
      });;
    });
  }

  delete_host(
    host_id: string,
    proxy_id?: string,
  ) {
    return this.get_proxy_by_host(host_id, proxy_id).then(
      proxy => {
        let host = proxy.hosts.id(host_id);
        if (host) {
          host.remove();
          return proxy.save();
        }
        return Promise.reject(CODE.HOST_NOT_EXIST);
      }
    );
  }
}

export default HostService;

import { service } from "../core";
import ProxyService from './proxy';
import { ProxyModel } from "../models/Proxy/index.d";
import updateSubDoc from "../tools/updateSubDoc";
import { Regs } from "../constants/reg";
import CODE from "../constants/code";
import ProxyAgent from "../agent/proxy";

@service()
class PatternService {
  constructor(
    private proxyService: ProxyService,
    private serverService: ProxyAgent,
  ) {}

  private get_proxy_by_pattern_id(
    pattern_id: string,
  ) {
    return this.proxyService.query_selective({
      'patterns._id': pattern_id,
    });
  }
  
  private populate_detail(
    proxy: ProxyModel.Proxy,
    pattern_id: string,
  ) {
    let pattern = proxy.patterns.id(pattern_id).toObject();
    let server = proxy.hosts.id(<string>pattern.server);
    pattern.server = server;
    return Promise.resolve(pattern);
  }

  private get_pattern_from_proxy(
    proxy: ProxyModel.Proxy,
    pattern_id: string,
  ) {
    return Promise.resolve(proxy.patterns.id(pattern_id));
  }

  get_detail(
    pattern_id: string,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id).then(
        (proxy) => {
          return this.populate_detail(proxy, pattern_id);
        }
      );
    }
    return this.get_proxy_by_pattern_id(pattern_id).then((proxy) => {
      return this.populate_detail(proxy, pattern_id);
    });
  }

  get_seletive(
    pattern_id: string,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id).then(
        (proxy) => {
          return this.get_pattern_from_proxy(proxy, pattern_id);
        }
      );
    }
    return this.get_proxy_by_pattern_id(pattern_id).then((proxy) => {
      return this.get_pattern_from_proxy(proxy, pattern_id);
    });
  }

  list(
    proxy_id: string,
  ) {
    return this.proxyService.get_selective(proxy_id).then(
      (proxy) => {
        return Promise.resolve(proxy.patterns);
      },
    );
  }
  
  private update_pattern_server(
    proxy: ProxyModel.Proxy,
    pattern: ProxyModel.PatternModel,
    server: string,
  ) {
    
  }

  update_proxy_pattern(
    proxy: ProxyModel.Proxy,
    pattern_id: string,
    data: ProxyModel.PatternBase,
  ) {
    let pattern = proxy.patterns.id(pattern_id);
    // TODO: 特殊处理server字段
    updateSubDoc(pattern, data, [
      'enable', 'pause', 'match', 'allow_methods', 'server', 'throttle', 'speed', 'delay',
      'handle', 'mock_status', 'mock_type', 'mock_content',
    ]);
    return proxy.save().then(newProxy => {
      this.serverService.update_config(proxy._id.toHexString(), newProxy);
      return Promise.resolve(newProxy);
    });
  }

  update_pattern(
    pattern_id: string,
    data: ProxyModel.PatternBase,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id).then(proxy => {
        return this.update_proxy_pattern(proxy, pattern_id, data);
      });
    }
    return this.get_proxy_by_pattern_id(pattern_id).then(proxy => {
      return this.update_proxy_pattern(proxy, pattern_id, data);
    });
  }

  create_proxy_pattern(
    proxy: ProxyModel.Proxy,
    pattern: ProxyModel.PatternBase,
  ) {
    proxy.patterns.push(pattern);
    return proxy.save().then(newProxy => {
      this.serverService.update_config(proxy._id.toHexString(), newProxy);
      return Promise.resolve(newProxy);
    });
  }
  
  valid_pattern_host(
    proxy: ProxyModel.Proxy,
    pattern: ProxyModel.PatternBase,
  ) {
    let { server } = pattern;
    if (!server) {
      return true;
    }
    return !!proxy.hosts.id(server as string);
  }

  create_pattern(
    data: ProxyModel.PatternBase,
    proxy_id: string,
  ) {
    return this.proxyService.get_selective(proxy_id).then(proxy => {
      if (this.valid_pattern_host(proxy, data)) {
        return this.create_proxy_pattern(proxy, data);
      }
      return Promise.reject(CODE.HOST_NOT_EXIST);
    });
  }
  
  delete_pattern_from_proxy(
    proxy: ProxyModel.Proxy,
    pattern_id: string,
  ) {
    let pattern = proxy.patterns.id(pattern_id);
    pattern.remove();
    return proxy.save().then(newProxy => {
      this.serverService.update_config(proxy._id.toHexString(), newProxy);
      return Promise.resolve(newProxy);
    });
  }

  delete_pattern(
    pattern_id: string,
    proxy_id?: string,
  ) {
    if (proxy_id) {
      return this.proxyService.get_selective(proxy_id).then(
        proxy => this.delete_pattern_from_proxy(proxy, pattern_id),
      );
    }
    return this.get_proxy_by_pattern_id(pattern_id).then(
      proxy => this.delete_pattern_from_proxy(proxy, pattern_id),
    );
  }
}

export default PatternService;

import { service } from "../core";
import Proxy from "../models/Proxy";
import { ProxyModel } from "../models/Proxy/index.d";
import CODE from "../constants/code";
import { page } from "../models/helper";
import mask_object from "../tools/maskObject";
import { PROXY_STATUS } from "../constants/proxy";
import ProxyAgent from "../agent/proxy";

@service()
class ProxyService {
  private proxys = new Map();
  constructor(
    private serverService: ProxyAgent,
  ) {}

  /**
   * 新建代理服务器
   */
  create(
    name: string,
    port: string,
    creator: string,
    patterns?: any[],
    hosts?: any[],
  ): Promise<ProxyModel.Proxy> {
    let proxy = new Proxy({
      name,
      port,
      creator,
      patterns,
      hosts,
    });

    return proxy.save().then((res) => {
      return res.populate('creator', '_id name');
    }, (err) => {
      if (err.code === 11000) {
        if (err.errmsg.indexOf('name') !== -1) {
          return Promise.reject(CODE.PROXY_NAME_EXIST);
        } else if (err.errmsg.indexOf('port') !== -1) {
          return Promise.reject(CODE.PROXY_PORT_OCCUPY);
        }
      }
      return Promise.reject(err);
    });
  }

  /**
   * 分页查询代理服务器
   */
  list(
    current: number = 1,
    size: number = 10,
  ) {
    return page(current, size, Proxy, {}, '_id name desc createdAt', {});
  }
  
  /**
   * 不分页查询代理服务器
   */
  list_all() {
    return Proxy.find({}, '_id name port private createdAt');
  }
  
  /**
   * 获得代理服务器详情
   */
  get_detail(
    proxy_id: string,
  ): Promise<ProxyModel.Proxy>  {
    return Proxy.findById(proxy_id).populate('creator', '_id name head').then((res) => {
      if (res) {
        return this.serverService.status(proxy_id).then(status => {
          let resObj = res.toObject();
          resObj.status = status;
  
          return Promise.resolve(resObj);
        });
      }
      return Promise.reject(CODE.PROXY_NOT_EXIST);
    });
  }
  
  /**
   * 根据id获取用于更新的文档
   */
  get_selective(
    proxy_id: string,
  ): Promise<ProxyModel.Proxy> {
    return Proxy.findById(proxy_id).then((res) => {
      if (res) {
        return Promise.resolve(res);
      }
      return Promise.reject(CODE.PROXY_NOT_EXIST);
    });
  }

  /**
   * 根据条件获取用于更新的文档
   */
  query_selective(
    query: object,
  ) {
    return Proxy.findOne(query).then(proxy => {
      if (proxy) {
        return Promise.resolve(proxy);
      }
      return Promise.reject(CODE.PROXY_NOT_EXIST);
    });
  }
  
  update_proxy_detail(
    proxy_id: string,
    data: any,
  ) {
    return Proxy.findOneAndUpdate({
      _id: proxy_id,
    }, mask_object(data, ['name', 'desc', 'port']), {
      new: true,
    }).catch((err) => {
      if (err.code === 11000) {
        if (err.errmsg.indexOf('name') !== -1) {
          return Promise.reject(CODE.PROXY_NAME_EXIST);
        } else if (err.errmsg.indexOf('port') !== -1) {
          return Promise.reject(CODE.PROXY_PORT_OCCUPY);
        }
      }
      return Promise.reject(err);
    });
  }
  /**
   * 更新代理服务器的name、desc、port属性
   */
  update_proxy(
    proxy_id: string,
    data: any,
  ) {
    if (data.port) { // 检查状态
      return this.serverService.status(proxy_id).then(status => {
        if (status === PROXY_STATUS.RUNNING) {
          return Promise.reject(CODE.RUNNING_PROXY_PORT_CANNOT_CHANGE);
        }

        return this.update_proxy_detail(proxy_id, data);
      });
    }

    return this.update_proxy_detail(proxy_id, data);
  }
  
  /**
   * 更新代理服务器状态
   */
  update_proxy_status(
    proxy_id: string,
    status: PROXY_STATUS,
  ) {
    return Proxy.findByIdAndUpdate(proxy_id, {
      status,
    }).then((effected) => {
      if (effected) {
        return Promise.resolve();
      }

      return Promise.reject(CODE.PROXY_NOT_EXIST);
    });
  }

  /**
   * 单独更新某个字段（慎用）
   */
  update_proxy_attr(
    proxy_id: string,
    key: string,
    data: any,
  ) {
    return this.get_selective(proxy_id).then(proxy => {
      proxy.set(key, data);
      return proxy.save().then(proxyNew => {
        this.serverService.update_config(proxy_id, proxyNew);
        return Promise.resolve(proxyNew);
      });
    });
  }
  
  /**
   * 设置代理服务器的默认目标服务器
   */
  set_proxy_default_host(
    proxy_id: string,
    host_id: string,
  ) {
    return this.get_selective(proxy_id).then((proxy) => {
      let hosts = proxy.hosts.toObject();
      let actives = hosts.filter(host => host.active);
      let acHost = proxy.hosts.id(host_id);
      if (acHost) {
        actives.map(active => {
          let host = proxy.hosts.id(active._id);
          host.set('active', undefined);
        });
        acHost.set('active', true);
        return proxy.save().then(newProxy => {
          this.serverService.update_config(proxy_id, newProxy);
          return Promise.resolve(newProxy.hosts);
        });
      }
      return Promise.reject(CODE.HOST_NOT_EXIST);
    });
  }
  
  /**
   * 创建一个目标服务器
   */
  create_host(
    proxy_id: string,
    host: ProxyModel.HostBase,
  ) {
    return this.get_selective(proxy_id).then((proxy) => {
      // ip-port 应该是唯一的
      let hosts = proxy.hosts.toObject();
      let existIpPort = hosts.filter(res => {
        return (res.target === host.target);
      });
      if (existIpPort.length === 0) {
        proxy.hosts.push(host);
        return proxy.save();
      }
      return Promise.reject(CODE.HOST_ALREADY_EXIST);
    }).then((proxy) => {
      return Promise.resolve(proxy.hosts.pop());
    });
  }
  
  /**
   * 删除指定代理（需要创建者本人删除）
   */
  delete_proxy(
    proxy_id: string,
    user_id: string,
  ) {
    return Proxy.findOneAndRemove({
      _id: proxy_id,
      creator: user_id,
    }).then(proxy => {
      if (proxy) {
        return Promise.resolve();
      }
      return Promise.reject(CODE.ONLY_CREATOR_CAN_DELETE_PROXY);
    });
  }
  
  /**
   * 强制删除指定代理
   */
  force_delete_proxy(
    proxy_id: string,
    user_id: string,
  ) {
    return Proxy.remove({
      _id: proxy_id,
    }).then(proxy => {
      if (proxy) {
        return Promise.resolve();
      }
      return Promise.reject(CODE.PROXY_NOT_EXIST);
    });
  }

  count_query(
    query: any,
  ) {
    return Proxy.count(query);
  }
}

export default ProxyService;

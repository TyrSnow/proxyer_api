import { controller, route, use } from "../core";
import HostService from "./../service/host";
import ProxyService from "../service/proxy";
import { SUCCESS, ERROR, LIST } from "../helper/response";
import PatternService from "../service/pattern";
import CODE from "../constants/code";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import { validate } from "../middleware/validator";
import ProxySchemas from "../schemas/proxy.schemas";

@controller({
  path: '/proxy',
  use: [auth(USER_AUTH.USER)],
})
class ProxyController {
  constructor(
    private proxyService: ProxyService,
    private patternService: PatternService,
    private hostService: HostService,
  ) {}
  
  /**
   * 修改一个host的参数
   */
  @route('/:proxy_id/hosts/:host_id', 'put')
  update_host(req, res) {
    const { proxy_id, host_id } = req.params;
    
    this.hostService.update_host(host_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 修改匹配模式的参数
   */
  @route('/:proxy_id/patterns/:pattern_id', 'put')
  update_pattern(req, res) {
    // 变更模式参数
    const { proxy_id, pattern_id } = req.params;

    this.patternService.update_pattern(pattern_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 修改代理下所有的匹配模式
   */
  @route('/:proxy_id/patterns', 'put')
  update_patterns(req, res) {
    const { proxy_id } = req.params;
    const { patterns } = req.body;

    this.proxyService.update_proxy_attr(proxy_id, 'patterns', patterns).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 修改代理资料
   */
  @route('/:proxy_id', 'put')
  update_proxy(req, res) {
    const { proxy_id } = req.params;

    this.proxyService.update_proxy(proxy_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 设置默认host地址
   */
  @route('/:proxy_id/hosts/:host_id/active', 'post')
  set_host_default(req, res) {
    const { host_id, proxy_id } = req.params;

    this.proxyService.set_proxy_default_host(proxy_id, host_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  /**
   * 创建一个匹配模式
   */
  @route('/:proxy_id/patterns', 'post')
  create_pattern(req, res) {
    // 添加一个模式
    const { proxy_id } = req.params;

    this.patternService.create_pattern(req.body, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 创建一个host
   */
  @route('/:proxy_id/hosts', 'post')
  create_host(req, res) {
    const { proxy_id } = req.params;

    this.proxyService.create_host(proxy_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 创建一个代理
   */
  @route('/', 'post')
  @use(validate(ProxySchemas.create))
  create(req, res) {
    // 创建一个新的代理
    const { name, port, proxyId } = req.body;
    const { _id } = req.user;
  
    if (proxyId) {
      return this.proxyService.get_selective(proxyId).then(
        proxy => {
          if (proxy) {
            let patterns = proxy.patterns.toObject().map(pattern => {
              delete pattern._id;
              return pattern;
            });
            let hosts = proxy.hosts.toObject().map(host => {
              delete host._id;
              return host;
            });

            return this.proxyService.create(name, port, _id, patterns, hosts);
          }
          return Promise.reject(CODE.PROXY_NOT_EXIST);
        },
      ).then(
        SUCCESS(req, res),
      ).catch(
        ERROR(req, res),
      );
    }
    return this.proxyService.create(name, port, _id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  /**
   * 获得host详情
   */
  @route('/:proxy_id/hosts/:host_id', 'get')
  get_host_detail(req, res) {
    const { proxy_id, host_id } = req.params;
  
    this.hostService.get_seletive(host_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  /**
   * 获得代理下的hosts列表
   */
  @route('/:proxy_id/hosts', 'get')
  list_hosts(req, res) {
    const { proxy_id } = req.params;
  
    this.hostService.list(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns/:pattern_id')
  get_pattern_detail(req, res) {
    // 获取模式详情
    const { proxy_id, pattern_id } = req.params;

    this.patternService.get_detail(pattern_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns', 'get')
  list_proxy_patterns(req, res) {
    const { proxy_id } = req.params;

    this.patternService.list(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'get')
  detail(req, res) {
    // 获取代理详情
    const { proxy_id } = req.params;
    
    this.proxyService.get_detail(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/')
  list(req, res) {
    const { current, size, all } = req.query;
    
    if (typeof all === 'string') {
      return this.proxyService.list_all().then(
        SUCCESS(req, res),
      ).catch(
        ERROR(req, res),
      );
    }
    this.proxyService.list(current, size).then(
      LIST(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns/:pattern_id', 'delete')
  delelte_pattern(req, res) {
    const { proxy_id, pattern_id } = req.params;

    this.patternService.delete_pattern(pattern_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/hosts/:host_id', 'delete')
  delete_host(req, res) {
    const { proxy_id, host_id } = req.params;

    this.hostService.delete_host(host_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'delete')
  delete_proxy(req, res) {
    const { proxy_id } = req.params;
    const { _id, auth } = req.user;

    if (auth === USER_AUTH.USER) {
      return this.proxyService.delete_proxy(proxy_id, _id).then(
        SUCCESS(req, res),
      ).catch(
        ERROR(req, res),
      );
    }
    return this.proxyService.force_delete_proxy(proxy_id, _id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default ProxyController;

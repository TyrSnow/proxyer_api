import { controller, route } from "../core/injector";
import HostService from "./../service/host";
import { auth, USER_AUTH } from "./../intercepror/auth";
import ProxyService from "../service/proxy";
import { SUCCESS, ERROR, LIST } from "../core/response";
import PatternService from "../service/pattern";

@controller({
  path: '/proxy',
})
class ProxyController {
  constructor(
    private proxyService: ProxyService,
    private patternService: PatternService,
    private hostService: HostService,
  ) {}

  @route('/:proxy_id/hosts/:host_id', 'put')
  @auth(USER_AUTH.USER)
  update_host(req, res) {
    const { proxy_id, host_id } = req.params;
    
    this.hostService.update_host(host_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns/:pattern_id', 'put')
  @auth(USER_AUTH.USER)
  update_pattern(req, res) {
    // 变更模式参数
    const { proxy_id, pattern_id } = req.params;

    this.patternService.update_pattern(pattern_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'put')
  @auth(USER_AUTH.USER)
  update_proxy(req, res) {
    const { proxy_id } = req.params;

    this.proxyService.update_proxy(proxy_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  @route('/:proxy_id/hosts/:host_id/active', 'post')
  @auth(USER_AUTH.USER)
  set_host_default(req, res) {
    const { host_id, proxy_id } = req.params;

    this.proxyService.set_proxy_default_host(proxy_id, host_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns', 'post')
  @auth(USER_AUTH.USER)
  create_pattern(req, res) {
    // 添加一个模式
    const { proxy_id } = req.params;

    this.proxyService.get_selective(proxy_id).then(
      (proxy) => {
        return proxy.add_pattern(req.body);
      }
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/hosts', 'post')
  @auth(USER_AUTH.USER)
  create_host(req, res) {
    const { proxy_id } = req.params;

    this.proxyService.create_host(proxy_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/', 'post')
  @auth(USER_AUTH.USER)
  create(req, res) {
    // 创建一个新的代理
    const { name, port } = req.body;
    const { _id } = req.user;

    this.proxyService.create(name, port, _id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
    
  @route('/:proxy_id/hosts/:host_id', 'get')
  @auth(USER_AUTH.USER)
  get_host_detail(req, res) {
    const { proxy_id, host_id } = req.params;
  
    this.hostService.get_seletive(host_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/hosts', 'get')
  @auth(USER_AUTH.USER)
  list_hosts(req, res) {
    const { proxy_id } = req.params;
  
    this.hostService.list(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/patterns/:pattern_id')
  @auth(USER_AUTH.USER)
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
  @auth(USER_AUTH.USER)
  list_proxy_patterns(req, res) {
    const { proxy_id } = req.params;

    this.patternService.list(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'get')
  @auth(USER_AUTH.USER)
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
  @auth(USER_AUTH.USER)
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
  @auth(USER_AUTH.USER)
  delelte_pattern(req, res) {
    const { proxy_id, pattern_id } = req.params;

    this.patternService.delete_pattern(pattern_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id/hosts/:host_id', 'delete')
  @auth(USER_AUTH.USER)
  delete_host(req, res) {
    const { proxy_id, host_id } = req.params;

    this.hostService.delete_host(host_id, proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'delete')
  @auth(USER_AUTH.USER)
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

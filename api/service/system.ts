import { service } from "../core";

@service()
class SystemService {
  private GUEST_PREFIX = 'guest';
  private GUEST_PASSWORD = '123456';

  get_global(name) {
     return this[name];
  }
  backup() { // 备份系统数据
  }

  reset() { // 重置系统
  }

  restart() { // 重启系统
  }
}

export default SystemService;

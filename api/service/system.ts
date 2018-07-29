import { service } from "../core/injector";

@service()
class SystemService {
  get_config() { // 读取系统配置
  }
  
  update_config() { // 更新配置
  }

  get_dict_by_name(name: string) { // 读取字典

  }

  get_dict_by_id(id: string) {

  }

  restore() { // 重置系统
  }

  restart() { // 重启系统
  }
}

export default SystemService;

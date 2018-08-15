import { controller, route } from "../core";

@controller({
  path: '/',
})
class DeployController {
  
  @route('/stats')
  get_sys_stat(req, res) {
    // 获取当前部署状态
  }

}

export default DeployController;

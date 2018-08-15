function C(code: number, message: string, status: number = 200, uri?: string) {
  return {
    code,
    message,
    status,
    uri,
  };
}

const CODE = {
  // 通用
  SUCCESS: C(10200, '操作完成'),
  ERROR: C(10500, '服务器异常'),
  ILLEGAL_ID: C(10400, '非法的参数'),
  OPERATIONS_PART_COMPLETE: C(10501, '部分操作未能完成'), // 非批量导入功能不要用这个错误
  ACCESS_DENY: C(10400, '用户操作被拒绝'),
  DOC_NOT_EXIST: C(10401, '资源不存在'),
  RESOURCE_CREATED: C(10500, '开始生成资源'), // 异步操作
  RESOURCE_NOT_READY: C(10501, '资源没有就绪'),
  RESOURCE_ERORR: C(10502, '资源生成失败'),
  NO_AUTH_OPERATE: C(10503, '不能进行这个操作'),

  // 用户权限
  NOT_AUTHORIZE: C(20000, '需要登陆才能进行此项操作', 401),
  LOW_AUTHORIZE: C(20001, '您的权限不足', 401),
  EXPIRE_AUTHORIZE: C(20002, '您已自动退出系统，请重新登陆', 401),
  DUMPLICAT_AUTHORIZE: C(20003, '您已在其他地方登陆', 401),
  NO_AUTH_TO_ACCESS_RESOURCE: C(20004, '您没有访问它的权限'),
  ACCOUNT_HAS_BLOCKED: C(20005, '您的账号已经被禁用'),
  NEED_ADMIN: C(20006, '需要管理员才能进行这项操作'),

  // 登陆注册
  WRONG_AUTHORIZE: C(21000, '用户名或密码错误'),
  USER_NOT_EXIST: C(21001, '用户不存在'),
  BLOCKED_USER: C(21002, '用户已经被冻结'),
  PASSWORD_NOT_MATCH: C(21003, '密码不匹配'),
  PASSWORD_ALREADY_IN_USE: C(21004, '密码已经在使用了'),

  DUMPLICATE_NAME: C(22001, '用户名已经被注册'),
  DUMPLICATE_PHONE: C(22002, '手机号已经被注册'),
  DUMPLICATE_EMAIL: C(22003, '邮箱已经被注册'),

  ILLEGAL_PASSWORD: C(23001, '非法的密码格式'),
  ILLEGAL_USERNAME: C(23002, '非法的用户名'),

  // Proxy
  PROXY_NAME_EXIST: C(30000, '代理名称已存在'),
  PROXY_NOT_EXIST: C(30001, '代理不存在'),
  HOST_NOT_EXIST: C(31000, '目标服务器不存在'),
  SERVER_LIST_EMPTY: C(32000, '没有可用的目标服务器'),
  NO_ACTIVE_SERVER_SET: C(32001, '没有指定缺省目标服务器'),
  HOST_ALREADY_EXIST: C(32003, '目标服务器已经存在'),
  PROXY_ALREADY_START: C(32004, '代理已经在运行'),
  PROXY_NOT_START: C(32005, '代理没有运行'),
  PROXY_START_ERROR: C(32005, '代理服务器启动失败'),
  PROXY_PORT_OCCUPY: C(32006, '目标端口已经被占用'),
  PROXY_PORT_UNEXIST: C(32007, '需要指定服务器端口号'),
  RUNNING_PROXY_PORT_CANNOT_CHANGE: C(32008, '运行中的服务器端口不能被修改'),
  ONLY_CREATOR_CAN_DELETE_PROXY: C(32009, '只有项目创建人可以删除此项目'),

  // Share
  SHARE_NOT_EXIST: C(40000, '分享码已经失效或过期'),
  SHARE_EXPIRES: C(40001, '分享码已经过期'),

  // 请求
  REQUEST_NOT_EXIST: C(50404, '请求不存在或已经被删除'),
};

export default CODE;

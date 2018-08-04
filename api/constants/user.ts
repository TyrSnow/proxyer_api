export enum USER_AUTH {
  SHARE_GUEST = -1,
  USER = 0,
  ADMIN,
  ROOT,
}

export const hasAuth = (request: USER_AUTH, type: USER_AUTH) => {
  return request <= type;
};

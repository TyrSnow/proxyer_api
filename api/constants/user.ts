export enum USER_AUTH {
  USER = 0,
  ADMIN,
  ROOT,
}

export const hasAuth = (request: USER_AUTH, type: USER_AUTH) => {
  return request <= type;
};

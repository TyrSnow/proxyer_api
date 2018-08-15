export enum PROTOCOL {
  HTTP = 0,
  HTTPS,
}

export enum METHOD {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  COPY,
  HEAD,
  OPTIONS,
  LINK,
  UNLINK,
  PURGE,
  LOCK,
  UNLOCK,
  PROPFIND,
  VIEW,
}

export const METHOD_NAME = {
  [METHOD.GET]: 'GET',
  [METHOD.POST]: 'POST',
  [METHOD.PUT]: 'PUT',
  [METHOD.PATCH]: 'PATCH',
  [METHOD.DELETE]: 'DELETE',
  [METHOD.COPY]: 'COPY',
  [METHOD.HEAD]: 'HEAD',
  [METHOD.OPTIONS]: 'OPTIONS',
  [METHOD.LINK]: 'LINK',
  [METHOD.UNLINK]: 'UNLINK',
  [METHOD.PURGE]: 'PURGE',
  [METHOD.LOCK]: 'LOCK',
  [METHOD.UNLOCK]: 'UNLOCK',
  [METHOD.PROPFIND]: 'PROPFIND',
  [METHOD.VIEW]: 'VIEW',
}

export const METHOD_MAP = {
  'GET': METHOD.GET,
  'get': METHOD.GET,
  'POST': METHOD.POST,
  'post': METHOD.POST,
  'PUT': METHOD.PUT,
  'put': METHOD.PUT,
  'PATCH': METHOD.PATCH,
  'patch': METHOD.PATCH,
  'DELETE': METHOD.DELETE,
  'delete': METHOD.DELETE,
  'COPY': METHOD.COPY,
  'copy': METHOD.COPY,
  'HEAD': METHOD.HEAD,
  'head': METHOD.HEAD,
  'OPTIONS': METHOD.OPTIONS,
  'options': METHOD.OPTIONS,
  'LINK': METHOD.LINK,
  'link': METHOD.LINK,
  'UNLINK': METHOD.UNLINK,
  'unlink': METHOD.UNLINK,
  'PURGE': METHOD.PURGE,
  'purge': METHOD.PURGE,
  'LOCK': METHOD.LOCK,
  'lock': METHOD.LOCK,
  'UNLOCK': METHOD.UNLOCK,
  'unlock': METHOD.UNLOCK,
  'PROPFIND': METHOD.PROPFIND,
  'propfind': METHOD.PROPFIND,
  'VIEW': METHOD.VIEW,
  'view': METHOD.VIEW,
}
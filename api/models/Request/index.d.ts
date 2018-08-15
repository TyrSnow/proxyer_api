import { Document } from 'mongoose';
import { ObjectID } from 'bson';

declare namespace RequestModel {
  interface ResponseInfo {
    headers?: Object
    content?: string
  }

  interface RequestInfo {
    _id: any
    url: string
    realPath: string
    realHostname: string
    realPort: string
    parent: string
    query: string
    params?: Object
    clientIp: string
    headers?: Object
    data?: Object
    method: string
    status: number
    cost: number
    finished: boolean
    mock: boolean
    requestContent?: string
    responseContent?: string
    responseHeaders?: any
    proxy: string
    pattern?: string
  }

  interface Request extends RequestInfo, Document {
  }
}
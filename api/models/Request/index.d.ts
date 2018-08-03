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
    method: string
    clientIp: string
    status: number
    finished: boolean
    cost: number
    proxy: string
    pattern?: string
    params?: Object
    headers?: Object
    data?: Object
  }

  interface Request extends RequestInfo, Document {
  }
}
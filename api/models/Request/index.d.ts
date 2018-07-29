import { Document } from 'mongoose';

declare namespace RequestModel {
  interface RequestBody {
    headers: Map<string, any>
    data: Map<string, any>
  }
  
  interface ResponseBody {
    headers: Map<string, any>
    data: Map<string, any>
  }

  interface RequestLog {
    request: RequestBody
    response: ResponseBody
  }

  interface Request extends Document {
    url: string
    method: string
    status: string
    log: RequestLog
    proxy: string
    pattern: string
  }
}
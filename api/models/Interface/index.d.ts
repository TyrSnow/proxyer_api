import { Document } from 'mongoose';

declare namespace InterfaceModel {
  interface interfcaeDetail {
    name?: string
    desc?: string
    requestHeaders?: Object
    requestParams?: Object
    requestBody?: Object
    responseHeaders?: Object
    responseBody?: Object
  }

  interface InterfaceInfo extends interfcaeDetail {
    url: string
    method: number
    count: number
    proxy: string
    ignore?: boolean
  }

  interface Interface extends InterfaceInfo, Document {}
}

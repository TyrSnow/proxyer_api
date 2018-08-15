import { Document } from 'mongoose';

declare namespace InterfaceModel {
  interface InterfaceInfo {
    url: string
    method: number
    count: number
    proxy: string
    ignore?: boolean
  }

  interface Interface extends InterfaceInfo, Document {}
}

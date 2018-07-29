import { Document, Schema, Types } from 'mongoose';
import { PATTERN_THROTTLE_TYPE } from "./../../constants/proxy";
import { PROXY_STATUS } from "./../../constants/proxy";
import { UserModel } from '../User';
import { METHOD } from '../../constants/http';

declare namespace ProxyModel {
  interface HostBase {
    name?: string
    target: string
    changeOrigin?: boolean
    disable?: boolean
    active?: boolean
  }

  interface HostSchema extends HostBase, Schema {

  }
  interface HostModel extends HostBase, Types.Subdocument {
  }
  
  interface Throttle {
    speed?: number
    delay?: number
  }
  
  interface PatternBase {
    match?: string | RegExp
    mathods?: METHOD[]
    enable?: boolean
    server?: string | HostModel
    throttle?: PATTERN_THROTTLE_TYPE
    delay?: number
    speed?: number
  }

  interface PatternSchema extends PatternBase, Schema {}
  interface PatternModel extends PatternBase, Types.Subdocument {}

  interface ProxyInfo {
    name: string
    desc?: string
    creator: string | UserModel.User
  }
  
  interface ProxyMethods {
    add_pattern(pattern: PatternBase): Promise<Proxy>
    detail(): Promise<Proxy>
  }

  interface Proxy extends ProxyMethods, ProxyInfo, Document {
    port: number
    active_port: number
    patterns: Types.DocumentArray<PatternModel>
    hosts: Types.DocumentArray<HostModel>
    prefix?: string
    status: PROXY_STATUS
  }
}

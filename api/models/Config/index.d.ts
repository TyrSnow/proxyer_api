import { Document, Schema } from 'mongoose';

declare namespace ConfigModel {
  interface Config extends Document {
    name: string
    label?: string
    desc?: string
    value: string | string[]
    enum?: any[]
    group?: string
  }
}

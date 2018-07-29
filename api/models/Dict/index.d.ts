import { Document, Schema } from 'mongoose';

declare namespace DictModel {
  interface DictDetail extends Schema {
    code: string
    value: string
    label: string
  }

  interface Dict extends Document {
    code: string
    value: string
    label: string
    detail: DictDetail
  }
}

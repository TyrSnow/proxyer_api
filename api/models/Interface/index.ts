import * as mongoose from 'mongoose';
import { InterfaceModel } from './index.d';

let model = new mongoose.Schema({
  url: String,
  method: Number,
  proxy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proxy',
  },
  ignore: Boolean,
  count: Number,
});

model.index({
  proxy: 1,
  url: 1,
  method: 1,
}, {
  unique: true,
});

const Interface = mongoose.model<InterfaceModel.Interface>('Interface', model);
export default Interface;

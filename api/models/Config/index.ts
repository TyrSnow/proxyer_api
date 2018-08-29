import * as mongoose from 'mongoose';

import { ConfigModel } from './index.d';

const Schema = mongoose.Schema;

const model = new Schema({
  name: {
    type: String,
    unique: true,
  },
  value: {
    type: String,
    unique: true,
  },
  label: String,
  desc: String,
  enum: [String],
  type: String,
});

model.index({
  name: 1,
});

const Config = mongoose.model<ConfigModel.Config>('Config', model);
export default Config;

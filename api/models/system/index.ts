import * as mongoose from 'mongoose';

import { SystemModel } from './index.d';

const Schema = mongoose.Schema;

const model = new Schema({
  name: String,
  label: String,
  type: String,
  value: String,
});

const System = mongoose.model<SystemModel.System>('System', model);
export default System;

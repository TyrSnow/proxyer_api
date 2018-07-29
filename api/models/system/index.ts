import * as mongoose from 'mongoose';

import { SystemModel } from './index.d';

const Schema = mongoose.Schema;

const model = new Schema({
  state: Boolean
});

const System = mongoose.model<SystemModel.System>('System', model);
export default System;

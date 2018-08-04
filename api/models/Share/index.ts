import * as mongoose from 'mongoose';
import { ShareModel } from './index.d';
import { SHARE_TYPE } from '../../constants/share';

let model = new mongoose.Schema({
  share_type: {
    type: Number,
    enum: SHARE_TYPE,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  payload: Object,
});

const Share = mongoose.model<ShareModel.Share>('Share', model);
export default Share;

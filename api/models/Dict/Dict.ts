import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Dict = new Schema({
  key: {
    type: String,
    unique: true,
  },
  desc: String,
  value: [{
    key: {
      type: String,
    },
    value: Number,
  }],
}, {
  timestamps: true,
});

export default Dict;

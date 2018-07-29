import { Document, Schema } from 'mongoose';
import { STATE } from '../../constants/system';

declare namespace SystemModel {
  interface System extends Document {
    state: STATE
  }
}

import { Document } from 'mongoose';
import { SHARE_TYPE } from "../../constants/share";

declare namespace ShareModel {
  interface ShareInfo {
    _id: any
    share_type: SHARE_TYPE
    creator: any
    payload: any
  }

  interface Share extends ShareInfo, Document {}
}

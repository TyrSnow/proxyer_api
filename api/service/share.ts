import { service } from "../core/injector";
import { SHARE_TYPE } from "../constants/share";
import Share from "../models/Share";
import CODE from "../constants/code";

@service()
class ShareService {
  /**
   * 构建一次分享
   */
  create_share_code(
    share_type: SHARE_TYPE,
    payload: any,
    creator: string,
  ) {
    let share = new Share({
      share_type,
      creator,
      payload,
    });

    return share.save();
  }
  
  /** 获得分享记录 */
  get_selective(
    share_id: string,
  ) {
    return Share.findById(share_id).then(share => {
      if (share) {
        return Promise.resolve(share);
      }

      return Promise.reject(CODE.SHARE_NOT_EXIST);
    });
  }

  /** 取消分享 */
  cancel_share(
    share_id: string,
    user_id: string,
  ) {
    return Share.findOneAndRemove({
      _id: share_id,
      creator: user_id,
    }).then(share => {
      if (share) {
        return Promise.resolve();
      }
      return Promise.reject(CODE.NO_AUTH_OPERATE);
    });
  }
}

export default ShareService;

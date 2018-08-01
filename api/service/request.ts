import { service } from "../core/injector";
import Request from "../models/Request";
import { page } from "../models/helper";

@service()
class RequestService {
  create_request(
    request: any,
  ) {
    let doc = new Request(request);

    return doc.save();
  }

  update_request(
    id: string,
    request: any,
  ) {
    return Request.findOneAndUpdate({
      _id: id,
    }, request);
  }
  
  list_status(
    proxy_id: string,
    status: number,
    current: number,
    pageSize: number,
  ) {
    return page(current, pageSize, Request, {
      proxy: proxy_id,
      status,
    });
  }

  /* 列出有过修改的请求 */
  list_modify(
    proxy_id: string,
    last_modify: Date,
  ) {
    const queryTime = new Date();
    return Request.find({
      proxy: proxy_id,
      updatedAt: {
        $gt: last_modify,
      },
    }, 'method finished status url query cost pattern').sort({
      _id: -1,
    }).then(list => {
      return Promise.resolve({
        list,
        last_modify: queryTime,
      });
    });
  }

  find_selective(
    request_id: string,
  ) {
    return Request.findById(request_id);
  }
}

export default RequestService;

import * as http from 'http';
import { service } from "../core";
import Request from "../models/Request";
import { page } from "../models/helper";
import CODE from '../constants/code';
import { RequestModel } from '../models/Request/index.d';
import { METHOD_NAME } from '../constants/http';

interface EmitFunc {
  (val0: any, val1: any): any
}
let emit: EmitFunc;

@service()
class RequestService {
  static LIST_PROJECTION = 'method finished status url query cost pattern clientIp parent';

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
    }, RequestService.LIST_PROJECTION).sort({
      _id: -1,
    }).then(list => {
      return Promise.resolve({
        list,
        last_modify: queryTime,
      });
    });
  }
  
  list_history(
    proxy_id: string,
    nearest_modify: Date,
    pageSize: number,
  ) {
    return Request.find({
      proxy: proxy_id,
      updatedAt: {
        $lt: nearest_modify,
      },
    }, RequestService.LIST_PROJECTION).sort({
      _id: -1,
    }).limit(pageSize);
  }

  list_interface_history(
    proxy_id: string,
    url: string,
    method: number,
  ) {
    return Request.find({
      proxy: proxy_id,
      url,
      method,
    });
  }

  find_selective(
    request_id: string,
  ) {
    return Request.findById(request_id);
  }

  map_reduce_proxy(
    proxy_id: string,
  ) {
    return Request.mapReduce({
      query: {
        proxy: proxy_id,
      },
      map: function () {
        emit({
          url: this.url,
          method: this.method
        }, 1);
      },
      reduce: function (key, vals) {
        return vals.length;
      }
    }).then((res) => {
      return Promise.resolve(res.results.map((data) => (
        Object.assign({
          count: data.value,
        }, data._id)
      )));
    });
  }

  private getRequestOption(request: RequestModel.Request, overwrite: any) {
    return {
      method: METHOD_NAME[request.method],
      headers: Object.assign(request.headers, overwrite.headers || {}),
      path: request.realPath,
      hostname: request.realHostname,
      port: request.realPort,
    };
  }

  cloneRequestLog(
    request: RequestModel.Request,
  ) {
    const requestLog = Object.assign({}, request.toObject());
    delete requestLog._id;
    delete requestLog.updatedAt;
    delete requestLog.createdAt;
    requestLog.parent = request._id;

    return requestLog;
  }

  send_request(
    request: RequestModel.Request,
    overwrite: any,
  ) {
    return new Promise((resolve, reject) => {
      const option = this.getRequestOption(request, overwrite);
      const requestLog = this.cloneRequestLog(request);

      const nReq = http.request(option, (nRes) => {
        requestLog.responseContent = '';
        requestLog.status = nRes.statusCode;
        requestLog.responseHeaders = nRes.headers;
  
        nRes.on('data', (data) => {
          requestLog.responseContent+= data;
        });
  
        nRes.on('end', () => {
          resolve(requestLog);
        });

        nRes.on('error', (err) => {
          console.log('request send has error: ', err);
          resolve(requestLog);
        })
      });
  
      nReq.write(request.requestContent);
      nReq.end();
    });
  }

  resend(
    request_id: string,
    rewrite: any,
  ) {
    return this.find_selective(request_id).then(
      request => {
        if (request) {
          return this.send_request(request, rewrite);
        }
        return Promise.reject(CODE.REQUEST_NOT_EXIST);
      }
    ).then((requestLog) => {
      return this.create_request(requestLog);
    });
  }
}

export default RequestService;

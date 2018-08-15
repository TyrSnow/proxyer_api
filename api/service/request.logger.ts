import { service } from "../core";
import RequestService from "./request";
import { RequestModel } from "../models/Request/index.d";

@service()
class RequestLogger {
  constructor(
    private requestService: RequestService,
  ) {}

  log(
    proxyId: string,
    log: RequestModel.RequestInfo,
  ) {
    const { _id, ...other } = log;
    this.requestService.find_selective(_id).then(logDoc => {
      if (logDoc) {
        return this.requestService.update_request(_id, other);
      }
      return this.requestService.create_request(Object.assign({
        proxy: proxyId,
      }, log)).catch(() => {
        return this.requestService.update_request(_id, other);
      });
    });
  }
}

export default RequestLogger;

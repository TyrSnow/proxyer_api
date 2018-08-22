import { InterfaceModel } from "../models/Interface/index.d";
import Interface from "../models/Interface";
import { service } from "../core";
import CODE from "../constants/code";
import RequestService from "./request";
import { RequestModel } from "../models/Request/index.d";

@service()
class InterfaceService {
  constructor(
    private requestService: RequestService,
  ) {}

  create_batch(
    proxy_id: string,
    interfaces: InterfaceModel.InterfaceInfo[],
  ) {
    let should_create = [];
    return Promise.all(interfaces.map(({ url, method, count }) => {
      return Interface.count({
        proxy: proxy_id,
        url,
        method,
      }).then(count => {
        if (count === 0) {
          should_create.push({
            proxy: proxy_id,
            url,
            method,
          });
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      })
    })).then(() => {
      return Interface.insertMany(should_create);
    });
  }
  
  get_selective(
    interface_id: string,
  ) {
    return Interface.findById(interface_id);
  }

  list_proxy_interfaces(
    proxy_id: string,
  ) {
    return Interface.find({
      proxy: proxy_id,
    });
  }

  ignore_interfaces(
    interface_ids: string[],
  ) {
    return Interface.updateMany({
      _id: {
        $in: interface_ids,
      },
    }, {
      ignore: true,
    });
  }

  remove_ignore_interfaces(
    interface_ids: string[],
  ) {
    return Interface.updateMany({
      _id: {
        $in: interface_ids,
      },
    }, {
      ignore: false,
    });
  }

  update_interface(
    interface_id: string,
    data: any,
  ) {
    return Interface.findByIdAndUpdate(interface_id, data, {
      new: true,
    }).then(res => {
      if (res) {
        return Promise.resolve(res);
      }
      return Promise.reject(CODE.INTERFACE_NOT_EXIST);
    });
  }
  
  private guess_field_type(
    fieldValues: any[],
  ) {
    
  }

  private combine_requests(
    requests: RequestModel.Request[]
  ) {
  }

  analyse_interface(
    interface_id: string,
  ) {
    // 拿资料，那所有记录，分析
    return this.get_selective(interface_id).then(
      inter => {
        if (inter) {
          return this.requestService.list_interface_history(inter.proxy, inter.url, inter.method);
        }
        
        return Promise.reject(CODE.INTERFACE_NOT_EXIST);
      }
    ).then(requests => {
      // const {
      //   requestHeaders, resquestBody, responseHeaders, responseBody,
      // } = this.combine_requests(requests);
    });
  }
}

export default InterfaceService;

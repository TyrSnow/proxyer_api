import { InterfaceModel } from "../models/Interface/index.d";
import Interface from "../models/Interface";
import { service } from "../core";

@service()
class InterfaceService {
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
    });
  }

  analyse_interface(
    interface_id: string,
  ) {
    // 拿资料，那所有记录，分析
  }
}

export default InterfaceService;

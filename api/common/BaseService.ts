import { Model } from 'mongoose';
import CODE from '../constants/code';

/**
 * 基础Service，提供针对某个model的CRUD操作
 * @export
 * @class BaseService
 */
export default class BaseService {
  protected model: Model<any>;

  create(data: any, creator?: string) {
    let doc = new this.model(Object.assign({
      creator,
    }, data));

    return doc.save().catch(err => {
      if (err.code === 11000) {
        return Promise.reject(CODE.DUMPLICATE_FIELD);
      }
      return Promise.reject(err);
    });
  }
  
  query(query: any, projections: any) {
    return this.model.find(query, projections);
  }
  
  /**
   * 分页查询
   * 采用soft分页，当尝试读取没有内容的页数时，会返回最后一页的内容
   */
  page(query: any, projections: any, pageSize: string, current: string) {
    const numPageSize = parseInt(pageSize, 10);
    const numCurrent = parseInt(current, 10);

    const result = { page: {
      pageSize: numPageSize,
      page: numCurrent,
      total: 0,
    }, list: [] };
    return this.model.count(query).then(total => {
      result.page.total = total;
      if (total === 0) {
        return Promise.resolve(result);
      }
      let skip = numPageSize * (numCurrent - 1);
      if (skip >= total) {
        // 计算最后一页的位置
        let lastPage = Math.ceil(total / numPageSize);
        result.page.page = lastPage;
        skip = numPageSize * (lastPage - 1);
      }
      return this.model.find(query, projections).skip(skip).limit(numPageSize).then(list => {
        result.list = list;
        return Promise.resolve(result);
      });
    });
  }

  getSelective(id: string) {
    return this.model.findById(id).then(res => {
      if (res) {
        return Promise.resolve(res);
      }

      return Promise.reject(CODE.DOC_NOT_EXIST);
    });
  }

  removeById(id: string) {
    return this.model.findByIdAndRemove({
      _id: id,
    }).then(res => {
      if (res) {
        return Promise.resolve();
      }
      return Promise.reject(CODE.DOC_NOT_EXIST);
    });
  }

  remove(query: any) {
    return this.model.remove(query);
  }
}

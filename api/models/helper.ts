import * as async from 'async';

export function page(current: number, size: number, Model: any, query: object, select: string, sort: object)  {
  let skip = (current - 1) * size;
  return new Promise((resolve, reject) => {
    async.parallel({
      page: function (done) {  // 查询数量
        Model.count(query).exec(function (err, total) {
          done(err, {
            current,
            size,
            total,
          });
        });
      },
      list: function (done) {   // 查询一页的记录
        Model.find(query, select).skip(skip).limit(size).sort(sort).exec(function (err, list) {
          done(err, list);
        });
      }
    }, function (err, results) {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

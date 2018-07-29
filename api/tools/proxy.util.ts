import * as net from 'net';
import { resolve } from 'url';

export function portIsOccupied (port) {
  return new Promise((resolve, reject) => {
    var server = net.createServer().listen(port)
  
    server.on('listening', function () { // 执行这块代码说明端口未被占用
      server.close(() => {
        resolve();
      }) // 关闭服务
    });
    
    server.on('error', function (err: any) {
      if (err.code === 'EADDRINUSE') { // 端口已经被使用
        reject(err);
      }
    })
  });
}
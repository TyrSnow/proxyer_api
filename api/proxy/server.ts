import * as http from 'http';
import * as net from 'net';
import * as url from 'url';
import params from './params';

import App from './app';

const app = new App();

process.on('message', (message) => {
  console.log('message receive: ', message);
  if (typeof message === 'string') {
    if (message === 'STOP') {
      process.exit(0);
    }
    return;
  }
  if (message.port) {
    try {
      app.set_config(message);
      process.send('PROXY_UPDATED');
    } catch (e) {
      process.exit(1);
    }
  } else if (message.id) {
    console.log('接收指令');
    app[message.func](message);
  }
});
process.on('uncaughtException', (e) => {
  console.debug('UncaughtException: ', e);
  process.exit(1);
})
app.listen(params.port);


function connect(cReq, cSock) {
  console.log('Connect request: ', cReq.url);
  var u = url.parse('http://' + cReq.url);

  var pSock = net.connect(parseInt(u.port), u.hostname, function() {
      cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      pSock.pipe(cSock);
  }).on('error', function(e) {
      cSock.end();
  });

  cSock.pipe(pSock);
}

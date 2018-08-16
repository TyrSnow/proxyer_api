import params from './params';

import App from './app';

const app = new App();


process.on('message', (message) => {
  console.debug('message receive: ', message);
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
      console.debug('Try to update config occur an error: ', e);
      process.exit(1);
    }
  } else if (message.id) {
    console.debug('接收指令');
    app[message.func](message);
  }
});

process.on('uncaughtException', (e) => {
  console.debug('UncaughtException: ', e);
  process.exit(1);
});

app.listen(params.port);

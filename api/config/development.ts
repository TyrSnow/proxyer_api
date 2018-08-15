const config = {
  port: 8081,
  secretKey: 'asd.,fas12309',
  db: {
    uri: 'mongodb://127.0.0.1:27017/proxyer',
    user: '',
    password: ''
  },
  upload: {
    temp: 'uploads',
    static: 'D:/nginx-1.12.2/html/',
    prefix: 'medias'
  },
  log: {
    appenders: {
      out: {
        type: 'console'
      },
      app: {
        type: 'datefile',
        filename: 'logs/access',
        patterm: '.yyyy-MM-dd-hh.log',
        alwaysIncludePattern: true,
        maxLogSize: 1024,
        backups: 4
      },
      error: {
        type: 'datefile',
        filename: 'logs/error',
        patterm: '.yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        maxLogSize: 1024,
        backups: 4
      }
    },
    categories: {
      default: {
        appenders: [
          'out', 'app'
        ],
        level: 'debug'
      },
      error: {
        appenders: [
          'out', 'error'
        ],
        level: 'debug'
      }
    },
    replaceConsole: true
  }
}

export default config;

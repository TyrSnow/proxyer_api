const config = {
  port: 8083,
  secretKey: 'unit.test.2018',
  db: {
    uri: `mongodb://127.0.0.1:27017/test_proxyer`,
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
      }
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'ERROR'
      },
      error: {
        appenders: ['out'],
        level: 'ERROR'
      }
    },
  }
}

export default config;

interface IDBConfig{
    uri: string
    user: string
    password: string
}
interface ILogConfig {
    appenders: any
    categories: any
    replaceConsole?: boolean
}

interface IUploadConfig {
    temp: string
    static: string
    prefix: string
}
interface IConfig {
    port: number | string
    secretKey: string
    db: IDBConfig
    log: ILogConfig
    upload: IUploadConfig
}

export default IConfig
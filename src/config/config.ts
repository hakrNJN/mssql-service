
export class AppConfig {
    private static readonly RABBITMQ_CONFIG = {
        url: process.env.MESSAGE_BROKER_URL || "localhost",
        port: process.env.MESSAGE_BROKER_PORT ? parseInt(process.env.MESSAGE_BROKER_PORT) : 5672,
        username: process.env.MESSAGE_BROKER_USER || "guest",
        password: process.env.MESSAGE_BROKER_PASS || "guest",
        vHost: process.env.MESSAGE_BROKER_HOST || "/",
    }

    public static readonly APP = {
        NAME: process.env.APP_NAME || "NEW APP",
        PORT: process.env.APP_PORT || 3000,
        ENVIRONMENT: process.env.NODE_ENV || "development",
        API_PREFIX: "api",
    } as const;

    public static readonly RABBITMQ_BROCKER = `amqp://${this.RABBITMQ_CONFIG.username}:${this.RABBITMQ_CONFIG.password}@${this.RABBITMQ_CONFIG.url}:${this.RABBITMQ_CONFIG.port}${this.RABBITMQ_CONFIG.vHost}`

    public static readonly DB_CONFIG = {
        type: "mssql",
        host: process.env.DB_HOST || "192.168.1.1",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
        username: process.env.DB_USER || "sa",
        password: process.env.DB_PASS || "password",
        database: process.env.DB_NAME || "test",
        synchronize: false,
        logging: true,
        entities: [],
        subscribers: [],
        migrations: [],
    } as const

    public static readonly AWSCredentials = {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        REGION: process.env.AWS_REGION
    }

    public static readonly Cloud_Log = {
        enabled: process.env.USE_CLOUD_LOG || false,
        logGroup: process.env.LOG_GROUP_NAME || `${this.APP.NAME}_LOG_GROUP`,
        logLevel: process.env.LOG_LEVEL || 'info',
    }
    
    public static readonly logLevel = process.env.LOG_LEVEL || "info";

    public static readonly allowedFormsForSaleSeries = ['frmSalBill/frmsalentry', 'frmSalRet/frmSalRetEntry', 'frmGreySale', 'frmGreySaleReturn', 'frmDebitNote'];

}

export class AppConfig {
    private static readonly RABBITMQ_CONFIG = {
        url: process.env.MESSAGE_BROKER_URL || "localhost",
        port: process.env.MESSAGE_BROKER_PORT ? parseInt(process.env.MESSAGE_BROKER_PORT) : 5672,
        username: process.env.MESSAGE_BROKER_USER,
        password: process.env.MESSAGE_BROKER_PASS,
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
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
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
    }
    
    public static readonly logLevel = process.env.LOG_LEVEL || "info";

    public static readonly allowedFormsForSaleSeries = ['frmSalBill/frmsalentry', 'frmSalRet/frmSalRetEntry', 'frmGreySale', 'frmGreySaleReturn', 'frmDebitNote'];

    public static readonly FEATURE_CONFIG_FILE_PATH = process.env.FEATURE_CONFIG_FILE_PATH || "./src/config/feature.config.yml";

    public static validateConfig(): void {
        const requiredEnvVars = [
            'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME',
            'MESSAGE_BROKER_URL', 'MESSAGE_BROKER_USER', 'MESSAGE_BROKER_PASS',
            'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION',
            'FEATURE_CONFIG_FILE_PATH'
        ];

        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        }

        // Additional validation for numeric ports
        if (process.env.DB_PORT && isNaN(parseInt(process.env.DB_PORT))) {
            throw new Error('Invalid DB_PORT. Must be a number.');
        }
        if (process.env.MESSAGE_BROKER_PORT && isNaN(parseInt(process.env.MESSAGE_BROKER_PORT))) {
            throw new Error('Invalid MESSAGE_BROKER_PORT. Must be a number.');
        }
    }
}
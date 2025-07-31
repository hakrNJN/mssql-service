"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
class AppConfig {
    static validateConfig() {
        const requiredEnvVars = [
            'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME',
            'MESSAGE_BROKER_URL', 'MESSAGE_BROKER_USER', 'MESSAGE_BROKER_PASS',
            'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'
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
exports.AppConfig = AppConfig;
_a = AppConfig;
AppConfig.RABBITMQ_CONFIG = {
    url: process.env.MESSAGE_BROKER_URL || "localhost",
    port: process.env.MESSAGE_BROKER_PORT ? parseInt(process.env.MESSAGE_BROKER_PORT) : 5672,
    username: process.env.MESSAGE_BROKER_USER,
    password: process.env.MESSAGE_BROKER_PASS,
    vHost: process.env.MESSAGE_BROKER_HOST || "/",
};
AppConfig.APP = {
    NAME: process.env.APP_NAME || "NEW APP",
    PORT: process.env.APP_PORT || 3000,
    ENVIRONMENT: process.env.NODE_ENV || "development",
    API_PREFIX: "api",
};
AppConfig.RABBITMQ_BROCKER = `amqp://${_a.RABBITMQ_CONFIG.username}:${_a.RABBITMQ_CONFIG.password}@${_a.RABBITMQ_CONFIG.url}:${_a.RABBITMQ_CONFIG.port}${_a.RABBITMQ_CONFIG.vHost}`;
AppConfig.DB_CONFIG = {
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
};
AppConfig.AWSCredentials = {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    REGION: process.env.AWS_REGION
};
AppConfig.Cloud_Log = {
    enabled: process.env.USE_CLOUD_LOG || false,
    logGroup: process.env.LOG_GROUP_NAME || `${_a.APP.NAME}_LOG_GROUP`,
};
AppConfig.logLevel = process.env.LOG_LEVEL || "info";
AppConfig.allowedFormsForSaleSeries = ['frmSalBill/frmsalentry', 'frmSalRet/frmSalRetEntry', 'frmGreySale', 'frmGreySaleReturn', 'frmDebitNote'];

export declare class AppConfig {
    private static readonly RABBITMQ_CONFIG;
    static readonly APP: {
        readonly NAME: string;
        readonly PORT: string | 3000;
        readonly ENVIRONMENT: string;
        readonly API_PREFIX: "api";
    };
    static readonly RABBITMQ_BROCKER: string;
    static readonly DB_CONFIG: {
        readonly type: "mssql";
        readonly host: string;
        readonly port: number;
        readonly username: string;
        readonly password: string;
        readonly database: string;
        readonly synchronize: false;
        readonly logging: true;
        readonly entities: readonly [];
        readonly subscribers: readonly [];
        readonly migrations: readonly [];
    };
    static readonly AWSCredentials: {
        ACCESS_KEY_ID: string | undefined;
        SECRET_ACCESS_KEY: string | undefined;
        REGION: string | undefined;
    };
    static readonly Cloud_Log: {
        enabled: string | boolean;
        logGroup: string;
        logLevel: string;
    };
    static readonly logLevel: string;
    static readonly allowedFormsForSaleSeries: string[];
}

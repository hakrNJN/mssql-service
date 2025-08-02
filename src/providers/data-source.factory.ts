import { DataSource, DataSourceOptions } from "typeorm";
import { AppConfig } from "../config/config";
import { ILogger } from "../interface/logger.interface";

export function createDataSource(dbName: string, entities: string[], logger: ILogger): DataSource {
    const DB_CONFIG = AppConfig.DB_CONFIG;

    const options: DataSourceOptions = {
        type: DB_CONFIG.type,
        host: DB_CONFIG.host,
        port: Number(DB_CONFIG.port),
        username: DB_CONFIG.username,
        password: DB_CONFIG.password,
        database: dbName,
        synchronize: DB_CONFIG.synchronize,
        logging: DB_CONFIG.logging,
        entities: entities,
        subscribers: [],
        migrations: [],
        connectionTimeout: 1500000,
        options: {
            encrypt: false,
        },
    };

    const dataSource = new DataSource(options);

    dataSource.initialize()
        .then(() => {
            logger.info(`${dbName} Data Source has been initialized!`);
        })
        .catch((err) => {
            logger.error(`Error during ${dbName} Data Source initialization`, err);
            throw err;
        });

    return dataSource;
}

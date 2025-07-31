import winston from 'winston';
import { AppDataSource } from '../providers/data-source.provider';
import { PhoenixDataSource } from '../providers/phoenix.data-source.provider';
export declare class DataSourceService {
    appDataSource: AppDataSource;
    phoenixDataSource: PhoenixDataSource;
    private readonly logger;
    constructor(appDataSource: AppDataSource, // Inject AppDataSource
    phoenixDataSource: PhoenixDataSource, // Inject PhoenixDataSource
    logger: winston.Logger);
    initializeDataSources(): Promise<void>;
    getAppDataSource(): AppDataSource;
    getPhoenixDataSource(): PhoenixDataSource;
}

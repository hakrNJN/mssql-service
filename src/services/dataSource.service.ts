// src/services/dataSource.service.ts
import { inject, injectable } from 'tsyringe'; // If using tsyringe or similar DI
import winston from 'winston';
import { AppDataSource } from '../providers/data-source.provider';
import { PhoenixDataSource } from '../providers/phoenix.data-source.provider';
import { WINSTON_LOGGER } from '../utils/logger';

@injectable() // or @singleton() with tsyringe
export class DataSourceService {
    public appDataSource: AppDataSource;
    public phoenixDataSource: PhoenixDataSource;
    private readonly logger: winston.Logger;

    constructor(
        @inject(AppDataSource) appDataSource: AppDataSource, // Inject AppDataSource
        @inject(PhoenixDataSource) phoenixDataSource: PhoenixDataSource,// Inject PhoenixDataSource
         @inject(WINSTON_LOGGER) logger: winston.Logger 
    ) {
        this.appDataSource = appDataSource;
        this.phoenixDataSource = phoenixDataSource;
        this.logger = logger
    }

    async initializeDataSources(): Promise<void> {
        await this.appDataSource.init();
        await this.phoenixDataSource.init();
        this.logger.info("DataSources initialized!");
    }

    getAppDataSource(): AppDataSource {
        return this.appDataSource;
    }

    getPhoenixDataSource(): PhoenixDataSource {
        return this.phoenixDataSource;
    }
}
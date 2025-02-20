// src/services/dataSource.service.ts
import { injectable } from 'tsyringe'; // If using tsyringe or similar DI
import { AppDataSource } from '../providers/data-source.provider';
import { PhoenixDataSource } from '../providers/phoenix.data-source.provider';

@injectable() // or @singleton() with tsyringe
export class DataSourceService {
    public appDataSource: AppDataSource;
    public phoenixDataSource: PhoenixDataSource;

    constructor() {
        this.appDataSource = new AppDataSource();
        this.phoenixDataSource = new PhoenixDataSource();
    }

    async initializeDataSources(): Promise<void> {
        await this.appDataSource.init();
        await this.phoenixDataSource.init();
        console.log("DataSources initialized!");
    }

    getAppDataSource(): AppDataSource {
        return this.appDataSource;
    }

    getPhoenixDataSource(): PhoenixDataSource {
        return this.phoenixDataSource;
    }
}
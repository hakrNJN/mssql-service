import { inject, singleton } from "tsyringe";
import { DataSource } from "typeorm";
import { AppConfig } from "../config/config";
import { ILogger } from "../interface/logger.interface";
import { createDataSource } from "../providers/data-source.factory"; // Your factory
import { WINSTON_LOGGER } from "../utils/logger";

@singleton()
export class DataSourceManager {
    public readonly mainDataSource: DataSource;
    public readonly phoenixDataSource: DataSource;

    constructor(@inject(WINSTON_LOGGER) private logger: ILogger) {
        // Use the factory to create the instances
        this.mainDataSource = createDataSource(
            AppConfig.DB_CONFIG.database,
            ["src/entity/anushreeDb/**/*.entity.ts", "src/entity/phoenixDb/**/*.entity.ts"],
            this.logger
        );

        this.phoenixDataSource = createDataSource(
            'pheonixDB', // The specific name for this DB
            ["src/entity/anushreeDb/**/*.entity.ts", "src/entity/phoenixDb/**/*.entity.ts"],
            this.logger
        );
    }

    // This single method will initialize ALL data sources.
    public async initializeDataSources(): Promise<void> {
        this.logger.info("Initializing all data sources...");
        await Promise.all([
            this.mainDataSource.initialize(),
            this.phoenixDataSource.initialize()
        ]);
        this.logger.info("All data sources have been initialized successfully!");
    }

    // This single method will close ALL data sources.
    public async closeDataSources(): Promise<void> {
        this.logger.info("Closing all data sources...");
        await Promise.all([
            this.mainDataSource.isInitialized ? this.mainDataSource.destroy() : Promise.resolve(),
            this.phoenixDataSource.isInitialized ? this.phoenixDataSource.destroy() : Promise.resolve()
        ]);
        this.logger.info("All data sources have been closed.");
    }
}
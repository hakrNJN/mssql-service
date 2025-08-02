//src/providers/data-source.provider.ts
import { inject, injectable } from "tsyringe";
import { DataSource } from "typeorm";
import { AppConfig } from "../config/config";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { createDataSource } from "./data-source.factory";

// const DB_CONFIG = AppConfig.DB_CONFIG; // Commented out

@injectable()
export class AppDataSource {
    private _dataSource: DataSource; // No longer nullable after factory initialization
    private readonly logger: ILogger;

    constructor(@inject(WINSTON_LOGGER) logger: ILogger) {
        this.logger = logger;
        this._dataSource = createDataSource(AppConfig.DB_CONFIG.database, ["src/entity/**/*.entity.ts"], this.logger);
    }

    // async init(): Promise<DataSource> { // Commented out
    //     if (!this._dataSource) {
    //         this._dataSource = new DataSource({
    //             type: DB_CONFIG.type,
    //             host: DB_CONFIG.host,
    //             port: Number(DB_CONFIG.port),
    //             username: DB_CONFIG.username,
    //             password: DB_CONFIG.password,
    //             database: DB_CONFIG.database,
    //             synchronize: DB_CONFIG.synchronize,
    //             logging: DB_CONFIG.logging,
    //             entities: ["src/entity/**/*.entity.ts"],
    //             subscribers: [],
    //             migrations: [],
    //             connectionTimeout: 1500000,
    //             options: {
    //                 encrypt: false,
    //             },
    //         });

    //         try {
    //             await this._dataSource.initialize();
    //             this.logger.info("App Data Source has been initialized!");
    //         } catch (err) {
    //             this.logger.error("Error during Data Source initialization", err);
    //             this._dataSource = null;
    //             throw err;
    //         }
    //     }
    //     return this._dataSource;
    // }

    async close(): Promise<void> {
        if (this._dataSource && this._dataSource.isInitialized) { // Check if initialized before destroying
            try {
                await this._dataSource.destroy();
                this.logger.info("App Data Source has been closed!");
                // this._dataSource = null; // No longer needed as it's managed by the factory
            } catch (err) {
                this.logger.error("Error during App Data Source closing", err);
                throw err;
            }
        } else {
            this.logger.info("App Data Source was already closed or not initialized.");
        }
    }

    getDataSource(): DataSource { // No longer nullable
        return this._dataSource;
    }
}
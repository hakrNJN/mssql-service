import { DataSource } from "typeorm";
import { AppConfig } from "../config/config";

const DB_CONFIG = AppConfig.DB_CONFIG

export class AppDataSource {

    private _dataSource: DataSource | null = null;

    async init(): Promise<DataSource> { // Return Promise<DataSource> for init
        if (!this._dataSource) {
            this._dataSource = new DataSource({
                type: DB_CONFIG.type,
                host: DB_CONFIG.host,
                port: Number(DB_CONFIG.port),
                username: DB_CONFIG.username,
                password: DB_CONFIG.password,
                database: DB_CONFIG.database,
                synchronize: DB_CONFIG.synchronize, // Use config from AppConfig
                logging: DB_CONFIG.logging,         // Use config from AppConfig
                entities: [],//DB_CONFIG.entities,       // Use config from AppConfig
                subscribers: [],//DB_CONFIG.subscribers, // Use config from AppConfig
                migrations: [],//DB_CONFIG.migrations,   // Use config from AppConfig
                connectionTimeout:1500000,
            });

            try {
                await this._dataSource.initialize();
                console.log("Data Source has been initialized!");
            } catch (err) {
                console.error("Error during Data Source initialization", err);
                this._dataSource = null; // Reset instance on error
                throw err; // Re-throw to propagate the error
            }
        }
        return this._dataSource; // Return the initialized DataSource instance
    }

    async close(): Promise<void> { // Return Promise<void> for close
        if (this._dataSource) {
            try {
                await this._dataSource.destroy(); // Use destroy instead of close for TypeORM >= 0.3
                console.log("Data Source has been closed!");
                this._dataSource = null; // Clear the instance after closing
            } catch (err) {
                console.error("Error during Data Source closing", err);
                throw err;
            }
        } else {
            console.log("Data Source was already closed or not initialized.");
        }
    }

    getDataSource(): DataSource | null { // Getter to access the DataSource instance (optional)
        return this._dataSource;
    }
} 
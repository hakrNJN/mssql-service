//src/providers/data-source.provider.ts
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
                database: DB_CONFIG.database,//Main Database
                synchronize: DB_CONFIG.synchronize,
                logging: DB_CONFIG.logging,        
                entities: ["src/entity/anushree/*.ts" ],//[YearMst, CompMst],
                subscribers: [],
                migrations: [],
                connectionTimeout: 1500000,
                options: {
                    encrypt: false, // Ensure encryption is enabled (if desired and configured on server)
                    // cryptoCredentialsDetails: {
                    //     minVersion: 'TLSv1.2' // Or 'TLSv1' if 1.2 doesn't work, but prefer 1.2 or higher
                    // }
                },
            });

            try {
                await this._dataSource.initialize();
                console.log("Data Source has been initialized!");
            } catch (err) {
                console.error("Error during Data Source initialization", err);
                this._dataSource = null; // Clear the instance after initialization error
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
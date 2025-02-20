// src/providers/phoenix-data-source.provider.ts
import { DataSource } from "typeorm";
import { AppConfig } from "../config/config";


const DB_CONFIG = AppConfig.DB_CONFIG;

export class PhoenixDataSource {
    private _dataSource: DataSource | null = null;

    async init(): Promise<DataSource> {
        if (!this._dataSource) {
            this._dataSource = new DataSource({
                type: DB_CONFIG.type,
                host: DB_CONFIG.host,
                port: Number(DB_CONFIG.port),
                username: DB_CONFIG.username,
                password: DB_CONFIG.password,
                database: 'pheonixDB',//DB_CONFIG.database,//Main Database
                synchronize: DB_CONFIG.synchronize,
                logging: DB_CONFIG.logging,        
                entities: ["src/entity/phoenix/*.ts" ],//[YearMst, CompMst],
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
                console.log("Phoenix Data Source has been initialized!");
            } catch (err) {
                console.error("Error during Phoenix Data Source initialization", err);
                this._dataSource = null;
                throw err;
            }
        }
        return this._dataSource;
    }

    async close(): Promise<void> {
        if (this._dataSource) {
            try {
                await this._dataSource.destroy();
                console.log("Phoenix Data Source has been closed!");
                this._dataSource = null;
            } catch (err) {
                console.error("Error during Phoenix Data Source closing", err);
                throw err;
            }
        } else {
            console.log("Phoenix Data Source was already closed or not initialized.");
        }
    }

    getDataSource(): DataSource | null {
        return this._dataSource;
    }
}
import { DataSource } from "typeorm";
import winston from "winston";
export declare class AppDataSource {
    private _dataSource;
    private readonly logger;
    constructor(logger: winston.Logger);
    init(): Promise<DataSource>;
    close(): Promise<void>;
    getDataSource(): DataSource | null;
}

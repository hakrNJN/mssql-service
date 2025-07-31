import { Application } from 'express';
import winston from 'winston';
import { DataSourceService } from './services/dataSource.service';
declare class App {
    app: Application;
    private readonly logger;
    private expressAppInstance;
    dataSourceService: DataSourceService;
    private eventDrivenController;
    private featuresService;
    private featureController;
    constructor(dataSourceService: DataSourceService, logger: winston.Logger);
    init(): Promise<void>;
    private initControllers;
    private initializeRoutes;
    startEventListeners(): Promise<void>;
    listen(port: string | number, callback?: () => void): void;
    private initializeErrorHandling;
    getServer(): Application;
}
export { App };

import { Application } from 'express';
import winston from 'winston';
import EventDrivenController from './controllers/eventDriven.controller';
import FeatureController from './controllers/feature.controller';
import ExpressApp from './providers/express.provider';
import { DataSourceService } from './services/dataSource.service';
import FeaturesService from './services/feature.service';
declare class App {
    app: Application;
    private readonly logger;
    private expressAppInstance;
    dataSourceService: DataSourceService;
    private eventDrivenController;
    private featuresService;
    private featureController;
    constructor(dataSourceService: DataSourceService, logger: winston.Logger, expressAppInstance: ExpressApp, featuresService: FeaturesService, eventDrivenController: EventDrivenController, featureController: FeatureController);
    init(): Promise<void>;
    private initControllers;
    private initializeRoutes;
    startEventListeners(): Promise<void>;
    listen(port: string | number, callback?: () => void): void;
    private initializeErrorHandling;
    getServer(): Application;
}
export { App };

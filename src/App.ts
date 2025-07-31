/// src/app.ts
import { Application } from 'express';
import { container, inject, injectable } from 'tsyringe';
import winston from 'winston';
import EventDrivenController from './controllers/eventDriven.controller';
import FeatureController from './controllers/feature.controller';
import { errorHandler } from './middleware/errorHandler';
import { timeTrackerMiddleware } from './middleware/TimeTracker.middleware';
import ExpressApp from './providers/express.provider';
import apiRoutes from './routes';
import { DataSourceService } from './services/dataSource.service';
import FeaturesService from './services/feature.service';
import { WINSTON_LOGGER } from './utils/logger';

// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

@injectable()
class App {
  public app: Application;
  private readonly logger: winston.Logger;
  private expressAppInstance: ExpressApp;
  public dataSourceService: DataSourceService;
  private eventDrivenController: EventDrivenController;
  private featuresService: FeaturesService;
  private featureController: FeatureController;

  constructor(
    dataSourceService: DataSourceService,
    @inject(WINSTON_LOGGER) logger: winston.Logger,
    @inject(ExpressApp) expressAppInstance: ExpressApp,
    @inject(FeaturesService) featuresService: FeaturesService,
    @inject(EventDrivenController) eventDrivenController: EventDrivenController,
    @inject(FeatureController) featureController: FeatureController
  ) {
    this.dataSourceService = dataSourceService;
    this.logger = logger;
    this.expressAppInstance = expressAppInstance;
    this.app = this.expressAppInstance.app;
    this.featuresService = featuresService;
    this.eventDrivenController = eventDrivenController;
    this.featureController = featureController;
    this.initControllers();
    // initializeRoutes(); // REMOVE from constructor - move to init()
    this.initializeErrorHandling(); // Keep error handling in constructor if it doesn't depend on featuresService
  }

  public async init(): Promise<void> { // in init()
    await this.featuresService.initialize(); // Initialize FeaturesService FIRST in init()
    this.initializeRoutes(); // THEN initialize routes - now it's guaranteed featuresService is ready
  }

  private initControllers(): void {
    // The featureController is now injected directly into the App class constructor.
    // No need to instantiate or resolve it here.
    // this.app.use('/features', this.featureController.handleRequest);
  }

  private initializeRoutes(): void {
    this.app.use('/api', timeTrackerMiddleware, apiRoutes(this.dataSourceService, this.featuresService)); // Passing the instance variable here
  }

  public async startEventListeners(): Promise<void> {
    await this.eventDrivenController.initialize();
    if (this.featuresService.isFeatureEnabled('startListening')) {
      this.logger.info('startListening feature is enabled. Starting EventDrivenController listeners...');
      await this.eventDrivenController.startEventListeners();
    } else {
      this.logger.info('startListening feature is disabled. Skipping EventDrivenController listeners.');
    }
  }

  public listen(port: string | number, callback?: () => void): void {
    this.app.listen(port, callback);
    this.startEventListeners();
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}

export { App };

// import { Application } from 'express';
// import { errorHandler } from './middleware/errorHandler';
// import ExpressApp from './providers/express.provider';
// import apiRoutes from './routes';
// import { Logger } from './utils/logger';

// class App {
//   public app: Application;
//   private logger = Logger.getInstance();
//   private expressAppInstance: ExpressApp;

//   constructor() {
//     this.expressAppInstance = new ExpressApp(); // Create instance here
//     this.app = this.expressAppInstance.app; // Access app from instance
//     this.initializeRoutes();
//     this.initializeErrorHandling();
//   }

//   private initializeRoutes(): void {
//     this.app.use('/api', apiRoutes);
//     // this.app.use('/api/test', new testRoutes().router); // Example route mounting
//   }

//   public listen(port: string | number, callback?: () => void): void {
//     this.app.listen(port, callback);
//   }

//   private initializeErrorHandling(): void {
//     this.app.use(errorHandler); // Assuming errorHandler is a function defined elsewhere
//   }

//   public getServer(): Application {
//     return this.app;
// }
// }

// export { App };

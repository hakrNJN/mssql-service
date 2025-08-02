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
import { DataSourceManager } from './services/dataSourceManager.service';
import FeaturesService from './services/feature.service';
import { AccountService } from './services/account.service';
import { CompanyService } from './services/company.service';
import { SeriesService } from './services/series.service';
import { WINSTON_LOGGER } from './utils/logger';

// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

@injectable()
class App {
  public app: Application;
  private readonly logger: winston.Logger;
  private expressAppInstance: ExpressApp;
  private eventDrivenController: EventDrivenController;
  private featuresService: FeaturesService;
  private featureController: FeatureController;
  private accountService: AccountService;
  private companyService: CompanyService;
  private seriesService: SeriesService;

  constructor(
    @inject(DataSourceManager) private dataSourceManager: DataSourceManager,
    @inject(WINSTON_LOGGER) logger: winston.Logger,
    @inject(ExpressApp) expressAppInstance: ExpressApp,
    @inject(FeaturesService) featuresService: FeaturesService,
    @inject(EventDrivenController) eventDrivenController: EventDrivenController,
    @inject(FeatureController) featureController: FeatureController,
    @inject(AccountService) accountService: AccountService,
    @inject(CompanyService) companyService: CompanyService,
    @inject(SeriesService) seriesService: SeriesService
  ) {
    
    this.logger = logger;
    this.expressAppInstance = expressAppInstance;
    this.app = this.expressAppInstance.app;
    this.featuresService = featuresService;
    this.eventDrivenController = eventDrivenController;
    this.featureController = featureController;
    this.accountService = accountService;
    this.companyService = companyService;
    this.seriesService = seriesService;
    this.initControllers();
    // initializeRoutes(); // REMOVE from constructor - move to init()
    this.initializeErrorHandling(); // Keep error handling in constructor if it doesn't depend on featuresService
  }

  public async init(): Promise<void> { // in init()
    await this.featuresService.initialize(); // Initialize FeaturesService FIRST in init()
    await this.dataSourceManager.initializeDataSources();
    this.initializeRoutes(); // THEN initialize routes - now it's guaranteed featuresService is ready
  }

  private initControllers(): void {
    // The featureController is now injected directly into the App class constructor.
    // No need to instantiate or resolve it here.
    // this.app.use('/features', this.featureController.handleRequest);
  }

  private initializeRoutes(): void {
    this.app.use('/api', timeTrackerMiddleware, apiRoutes(this.featuresService));
  }

  public async startEventListeners(): Promise<void> {
    const enableRabbitMQ = this.featuresService.isFeatureEnabled('enableRabbitMQ');

    if (enableRabbitMQ) {
      this.logger.info('RabbitMQ is enabled. Initializing EventDrivenController...');
      await this.eventDrivenController.initialize();

      if (this.featuresService.isFeatureEnabled('startListening')) {
        this.logger.info('startListening feature is enabled. Starting EventDrivenController listeners...');
        await this.eventDrivenController.startEventListeners();
      } else {
        this.logger.info('startListening feature is disabled. Skipping EventDrivenController listeners.');
      }
    } else {
      this.logger.info('RabbitMQ is disabled. Skipping EventDrivenController initialization and listeners.');
    }
  }

  public listen(port: string | number, callback?: () => void): any {
    const server = this.app.listen(port, callback);
    this.startEventListeners();
    return server;
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

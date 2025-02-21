/// src/app.ts
import { Application } from 'express';
import { container } from 'tsyringe';
import EventDrivenController from './controllers/eventDriven.controller';
import FeatureController from './controllers/feature.controller';
import { errorHandler } from './middleware/errorHandler';
import { timeTrackerMiddleware } from './middleware/TimeTracker.middleware';
import ExpressApp from './providers/express.provider';
import apiRoutes from './routes';
import { DataSourceService } from './services/dataSource.service';
import FeaturesService from './services/feature.service';
import { Logger } from './utils/logger';

class App {
  public app: Application;
  private logger = Logger.getInstance();
  private expressAppInstance: ExpressApp;
  public dataSourceService: DataSourceService;
  private eventDrivenController: EventDrivenController;
  private featuresService: FeaturesService;
  private featureController!: FeatureController;


  constructor(dataSourceService: DataSourceService) {
    this.dataSourceService = dataSourceService;
    this.expressAppInstance = new ExpressApp();
    this.app = this.expressAppInstance.app;
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.featuresService = container.resolve(FeaturesService);
    this.eventDrivenController = container.resolve(EventDrivenController);
    this.initControllers();
  }

  private initControllers(): void {
    const featuresService = container.resolve(FeaturesService);
    this.featureController = new FeatureController(featuresService);
    // this.app.use('/features', this.featureController.handleRequest); // it will be already routed via /api in initializeRoutes()
}

  private initializeRoutes(): void {
    this.app.use('/api', timeTrackerMiddleware, apiRoutes(this.dataSourceService));
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
    this.startEventListeners(); // Call startEventListeners here, AFTER the server starts listening
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

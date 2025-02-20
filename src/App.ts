//src/app.ts
import { Application } from 'express';
import { errorHandler } from './middleware/errorHandler';
import { timeTrackerMiddleware } from './middleware/TimeTracker.middleware';
import ExpressApp from './providers/express.provider';
import apiRoutes from './routes';
import { DataSourceService } from './services/dataSource.service';
import { Logger } from './utils/logger';

class App {
  public app: Application;
  private logger = Logger.getInstance();
  private expressAppInstance: ExpressApp;
  public dataSourceService: DataSourceService; 
  // public dataSource: AppDataSource; // Add dataSource property
  // public pheonixDataSource: PhoenixDataSource;

  
  // constructor(dataSourceInstance: AppDataSource, pheonixDataSourceInstance : PhoenixDataSource) { // Receive dataSourceInstance in constructor
  //   this.dataSource = dataSourceInstance; // Assign dataSourceInstance to this.dataSource
  // this.pheonixDataSource = pheonixDataSourceInstance; // Assign dataSourceInstance to this.dataSource

constructor(dataSourceService: DataSourceService) { // Receive DataSourceService in constructor
  this.dataSourceService = dataSourceService;
    this.expressAppInstance = new ExpressApp();
    this.app = this.expressAppInstance.app;
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeRoutes(): void {
    this.app.use('/api', timeTrackerMiddleware, apiRoutes(this.dataSourceService)); // Pass DataSourceService to routes
    // this.app.use('/api', apiRoutes(this.dataSource, this.pheonixDataSource)); // Pass dataSource to routes
    // this.app.use('/api/test', new testRoutes().router); // Example route mounting
  }

  public listen(port: string | number, callback?: () => void): void {
    this.app.listen(port, callback);
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

//src/app.ts
import { Application } from 'express';
import { errorHandler } from './middleware/errorHandler';
import { AppDataSource } from './providers/data-source.provider'; // Import AppDataSource
import ExpressApp from './providers/express.provider';
import apiRoutes from './routes';
import { Logger } from './utils/logger';

class App {
  public app: Application;
  private logger = Logger.getInstance();
  private expressAppInstance: ExpressApp;
  public dataSource: AppDataSource; // Add dataSource property

  constructor(dataSourceInstance: AppDataSource) { // Receive dataSourceInstance in constructor
    this.dataSource = dataSourceInstance; // Assign dataSourceInstance to this.dataSource
    this.expressAppInstance = new ExpressApp();
    this.app = this.expressAppInstance.app;
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeRoutes(): void {
    this.app.use('/api', apiRoutes(this.dataSource)); // Pass dataSource to routes
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

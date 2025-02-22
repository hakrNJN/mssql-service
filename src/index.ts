// src/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from './App';
import { AppConfig } from './config/config';
import { DataSourceService } from "./services/dataSource.service";
import { registerDependencies } from "./utils/registerDependencies";

// Register all dependencies
registerDependencies();

// Resolve the Winston Logger from the container
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

async function startServer() {
  

  try {

    // Register the Winston Logger with tsyringe.
    // We register the LoggerProvider as a singleton, and then resolve the winston.Logger instance from it.
    const dataSourceService = container.resolve(DataSourceService);
    // const app = new App(dataSourceService);
    const app = container.resolve(App);
    app.listen(AppConfig.APP.PORT, () => {
      console.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

// import "reflect-metadata";
// import { App } from './App';
// import { AppConfig } from './config/config';
// import { Logger } from './utils/logger';

// const logger = Logger.getInstance();

// try {
//   const app = new App();
//   app.listen(AppConfig.APP.PORT, () => {
//     logger.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
//   });
// } catch (error) {
//   logger.error('Error starting server:', error);
//   process.exit(1);
// }
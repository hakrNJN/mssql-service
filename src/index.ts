// src/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from './App';
import { AppConfig } from './config/config';
import { DataSourceService } from "./services/dataSource.service";
import { registerDependencies } from "./utils/registerDependencies";
import { ILogger } from './interface/logger.interface';
import { WINSTON_LOGGER } from './utils/logger';

// Register all dependencies
registerDependencies();

// Resolve the Winston Logger from the container
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

async function startServer() {
  const logger = container.resolve<ILogger>(WINSTON_LOGGER);
  try {
    const dataSourceService = container.resolve(DataSourceService);
    const app = container.resolve(App);
    await app.init(); // Call app.init() to handle async initialization - This is crucial and correct

    app.listen(AppConfig.APP.PORT, () => {
      console.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
    });

  } catch (error) {
    logger.error('Error starting server:', error);
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
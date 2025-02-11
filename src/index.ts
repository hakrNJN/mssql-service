// src/index.ts
import "reflect-metadata";
import { App } from './App';
import { AppConfig } from './config/config';
import { AppDataSource } from './providers/data-source.provider'; // Import AppDataSource
import { Logger } from './utils/logger';

const logger = Logger.getInstance();

async function startServer() { // Make the start function async
  try {
    const dataSourceInstance = new AppDataSource(); // Create DataSource instance
    await dataSourceInstance.init(); // Initialize DataSource here, await the promise

    const app = new App(dataSourceInstance); // Pass dataSourceInstance to App constructor
    app.listen(AppConfig.APP.PORT, () => {
      logger.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
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
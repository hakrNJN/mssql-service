// src/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from './App';
import { AppConfig } from './config/config';
import { DataSourceService } from "./services/dataSource.service";
import { Logger } from './utils/logger';

const logger = Logger.getInstance();

async function startServer() { // Make the start function async
  try {
    // const dataSourceInstance = new AppDataSource(); // Create DataSource instance
    // await dataSourceInstance.init(); // Initialize DataSource here, await the promise
    // const pheonixDataSourceInstance = new PhoenixDataSource(); // Create DataSource instance
    // await pheonixDataSourceInstance.init(); // Initialize DataSource here, await the promise

    // const app = new App(dataSourceInstance, pheonixDataSourceInstance); // Pass dataSourceInstance to App constructor

    const dataSourceService = new DataSourceService(); // Create DataSourceService instance
        await dataSourceService.initializeDataSources(); // Initialize DataSources

        // Register DataSourceService with DI container (if using tsyringe)
        container.register(DataSourceService, { useValue: dataSourceService });

        const app = new App(dataSourceService); // Pass DataSourceService to App constructor (instead of individual DataSources)
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
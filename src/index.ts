// src/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from './App';
import { AppConfig } from './config/config';
import { ILogger } from './interface/logger.interface';
import { DataSourceService } from "./services/dataSource.service";
import { WINSTON_LOGGER } from './utils/logger';
import { registerDependencies } from "./utils/registerDependencies";

// Register all dependencies
registerDependencies();

async function startServer() {
  const logger = container.resolve<ILogger>(WINSTON_LOGGER);
  const dataSourceService = container.resolve(DataSourceService);
  const app = container.resolve(App);
  let server: any; // Declare server variable

  try {
    AppConfig.validateConfig(); // Validate configuration at startup
    await app.init(); // Call app.init() to handle async initialization - This is crucial and correct

    server = app.listen(AppConfig.APP.PORT, () => {
      logger.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
    });

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }

  const gracefulShutdown = async () => {
    logger.info('Shutting down gracefully...');
    // Close the HTTP server
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed.');
      });
    }

    // Close database connections
    await dataSourceService.closeDataSources();

    logger.info('Application shut down.');
    process.exit(0);
  };

  // Listen for termination signals
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer();
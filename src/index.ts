import "reflect-metadata";
import { App } from './App';
import { AppConfig } from './config/config';
import { Logger } from './utils/logger';

const logger = Logger.getInstance();

try {
  const app = new App();
  app.listen(AppConfig.APP.PORT, () => {
    logger.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
  });
} catch (error) {
  logger.error('Error starting server:', error);
  process.exit(1);
}
// src/index.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from './App';
import { AppConfig } from './config/config';
import EventDrivenController from "./controllers/eventDriven.controller";
import { DataSourceService } from "./services/dataSource.service";
import FeaturesService from "./services/feature.service";
import PublisherRabbitMQService from "./services/publisher.RabbitMQ.service";
import RabbitMQClientService from "./services/rabbitMQ.service";
import { Logger } from './utils/logger';

const logger = Logger.getInstance();

async function startServer() {
  try {

    const dataSourceService = new DataSourceService();
    await dataSourceService.initializeDataSources();

    container.register(DataSourceService, { useValue: dataSourceService });

    // **Register RabbitMQClientService and PublisherRabbitMQService here**
    const rabbitMQConnectionUrl = {connectionUrl:AppConfig.RABBITMQ_BROCKER}; // Replace with your RabbitMQ connection URL
    container.register(RabbitMQClientService, { useValue: new RabbitMQClientService(rabbitMQConnectionUrl) });
    container.register(PublisherRabbitMQService, { useFactory: (c) => new PublisherRabbitMQService(c.resolve(RabbitMQClientService)) });
    container.register(EventDrivenController, { useFactory: (c) => new EventDrivenController(c.resolve(RabbitMQClientService), c.resolve(PublisherRabbitMQService), c.resolve(FeaturesService)) });

    const app = new App(dataSourceService);
    app.listen(AppConfig.APP.PORT, () => {
      logger.info(`${AppConfig.APP.NAME} server is running on port ${AppConfig.APP.PORT} in ${AppConfig.APP.ENVIRONMENT} environment`);
    });

    // No need to call app.startEventListeners() here anymore, it's called inside app.listen() in App.ts

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
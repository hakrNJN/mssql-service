// src/utils/registerDependencies.ts
import { join } from 'path'; // Import path
import { container } from "tsyringe";
import winston from 'winston';
import { AppConfig } from '../config/config';
import EventDrivenController from "../controllers/eventDriven.controller";
import { AppDataSource } from "../providers/data-source.provider";
import FileService from "../providers/fileService.provider";
import { PhoenixDataSource } from "../providers/phoenix.data-source.provider";
import { DataSourceService } from "../services/dataSource.service";
import FeaturesService from "../services/feature.service";
import PublisherRabbitMQService from "../services/publisher.RabbitMQ.service";
import RabbitMQClientService from "../services/rabbitMQ.service";
import { PurchaseParcelStatusService } from '../services/PurchaseInwardOutWard.service';
import { KotakCMSService } from '../services/KotakCMS.Service';
import { Logger, WINSTON_LOGGER } from "./logger";
import { ILogger } from '../interface/logger.interface';
import { KotakCMSController } from '../controllers/KotakCMS.controller';
import { PurchasePipeLineController } from '../controllers/purchasePipeLine.controller';

// Define a token for FileService if you want to use interface injection.
// export const FILE_SERVICE_TOKEN = Symbol('FileServiceToken') as InjectionToken<FileService>; // Not strictly needed here

export function registerDependencies(): void {

  // Register Winston Logger
  container.register<ILogger>(WINSTON_LOGGER, {
    useFactory: () => {
      const loggerInstance = Logger.createLogger();
      return loggerInstance;
    }
  });

  // Register DataSourceService
  container.register(DataSourceService, { useClass: DataSourceService });
  container.register(AppDataSource, { useClass: AppDataSource });
  container.register(PhoenixDataSource, { useClass: PhoenixDataSource });

  // Register RabbitMQClientService
  const rabbitMQConnectionUrl = { connectionUrl: AppConfig.RABBITMQ_BROCKER };
  container.register(RabbitMQClientService, {
    useFactory: (c) => new RabbitMQClientService(rabbitMQConnectionUrl, c.resolve(WINSTON_LOGGER))
  });

  // Register RabbitMQPublisherService
  container.register(PublisherRabbitMQService, {
    useFactory: (c) => new PublisherRabbitMQService(
      c.resolve(RabbitMQClientService),
      c.resolve(WINSTON_LOGGER)
    )
  });

  // **Register FileService using a factory function:**
  container.register(FileService, { // Register FileService directly, or use FILE_SERVICE_TOKEN if you had an interface token
    useFactory: (c) => {
      const filePath = join(__dirname, '../config', 'feature.config.yml'); // Define filePath here, same as in FeaturesService
      return new FileService(filePath, c.resolve(WINSTON_LOGGER)); // Resolve logger from container
    }
  });

  container.register(FeaturesService, { useClass: FeaturesService });

  // Register FeaturesService (implicitly registered as it's injectable and singleton)

  // Register Event Controller
  container.register(EventDrivenController, {
    useFactory: (c) => new EventDrivenController(
      c.resolve(RabbitMQClientService),
      c.resolve(PublisherRabbitMQService),
      c.resolve(FeaturesService),
      c.resolve(WINSTON_LOGGER)
    )
  });

    container.register(PurchaseParcelStatusService, {
    useFactory: (c) => {
      const dataSourceInstance = c.resolve(AppDataSource);
      const service = new PurchaseParcelStatusService(dataSourceInstance);
      return service;
    }
  });

  container.register(PurchasePipeLineController, {
    useFactory: (c) => new PurchasePipeLineController(c.resolve(PurchaseParcelStatusService))
  });

   // --- Register KotakCMSService and KotakCMSController ---

  // Register KotakCMSService
  container.register(KotakCMSService, {
    useFactory: (c) => {
      const dataSourceInstance = c.resolve(AppDataSource);
      const service = new KotakCMSService(dataSourceInstance);
      return service;
    }
  });

  // Register KotakCMSController
  container.register(KotakCMSController, {
    useFactory: (c) => new KotakCMSController(c.resolve(KotakCMSService))
  });
}
// src/utils/registerDependencies.ts
import { join } from 'path'; // Import path
import { container } from "tsyringe";
import { AppConfig } from '../config/config';
import EventDrivenController from "../controllers/eventDriven.controller";
import { KotakCMSController } from '../controllers/kotakCMS.controller';
import { PurchasePipeLineController } from '../controllers/purchasePipeLine.controller';
import { ILogger } from '../interface/logger.interface';
import { AppDataSource } from "../providers/data-source.provider";
import FileService from "../providers/fileService.provider";
import { PhoenixDataSource } from "../providers/phoenix.data-source.provider";
import { AccountService } from "../services/account.service";
import { DataSourceService } from "../services/dataSource.service";
import FeaturesService from "../services/feature.service";
import { KotakCMSService } from '../services/kotakCMS.service';
import { NoOpPublisherRabbitMQService } from "../services/noOpPublisherRabbitMQ.service";
import { NoOpRabbitMQClientService } from "../services/noOpRabbitMQ.service";
import PublisherRabbitMQService from "../services/publisher.RabbitMQ.service";
import { PurchaseParcelStatusService } from '../services/purchaseInwardOutWard.service';
import RabbitMQClientService from "../services/rabbitMQ.service";
import { Logger, WINSTON_LOGGER } from "./logger";

export const RABBITMQ_CLIENT_SERVICE = Symbol('RabbitMQClientService');
export const PUBLISHER_RABBITMQ_SERVICE = Symbol('PublisherRabbitMQService');

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

  // Register FileService and its dependencies first, as FeaturesService depends on it.
  container.register(FileService, {
    useFactory: (c) => new FileService(AppConfig.FEATURE_CONFIG_FILE_PATH, c.resolve(WINSTON_LOGGER))
  });
  container.register(FeaturesService, { useClass: FeaturesService });

  const featuresService = container.resolve(FeaturesService);
  const features = featuresService.getFeatures();
  const enableRabbitMQ = features.enableRabbitMQ;

  if (enableRabbitMQ) {
    // Register RabbitMQClientService
    const rabbitMQConnectionUrl = { connectionUrl: AppConfig.RABBITMQ_BROCKER };
    container.register(RABBITMQ_CLIENT_SERVICE, {
      useFactory: (c) => new RabbitMQClientService(rabbitMQConnectionUrl, c.resolve(WINSTON_LOGGER))
    });

    // Register RabbitMQPublisherService
    container.register(PUBLISHER_RABBITMQ_SERVICE, {
      useFactory: (c) => new PublisherRabbitMQService(
        c.resolve(RABBITMQ_CLIENT_SERVICE),
        c.resolve(WINSTON_LOGGER)
      )
    });
  } else {
    // Register No-Op RabbitMQClientService
    container.register(RABBITMQ_CLIENT_SERVICE, {
      useFactory: (c) => new NoOpRabbitMQClientService(c.resolve(WINSTON_LOGGER))
    });

    // Register No-Op RabbitMQPublisherService
    container.register(PUBLISHER_RABBITMQ_SERVICE, {
      useFactory: (c) => new NoOpPublisherRabbitMQService(c.resolve(WINSTON_LOGGER))
    });
  }

  // Register AccountService
  container.register(AccountService, {
    useFactory: (c) => {
      const dataSourceInstance = c.resolve(AppDataSource);
      const service = new AccountService(dataSourceInstance);
      return service;
    }
  });

  // Register Event Controller
  container.register(EventDrivenController, {
    useFactory: (c) => new EventDrivenController(
      c.resolve(RABBITMQ_CLIENT_SERVICE),
      c.resolve(PUBLISHER_RABBITMQ_SERVICE),
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
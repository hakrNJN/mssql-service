// src/utils/registerDependencies.ts
// src/utils/registerDependencies.ts
import { container } from "tsyringe";
import { AppConfig } from '../config/config';
import EventDrivenController from "../controllers/eventDriven.controller";
import { KotakCMSController } from '../controllers/kotakCMS.controller';
import { PurchasePipeLineController } from '../controllers/purchasePipeLine.controller';
import { ILogger } from '../interface/logger.interface';
import { AccountService } from "../services/account.service";
import { CompanyService } from '../services/company.service';

import { DataSourceManager } from "../services/dataSourceManager.service";
import { MAIN_DATA_SOURCE, PHOENIX_DATA_SOURCE } from "../types/symbols";
import FeaturesService from "../services/feature.service";
import { KotakCMSService } from '../services/kotakCMS.service';
import { NoOpPublisherRabbitMQService } from "../services/noOpPublisherRabbitMQ.service";
import { NoOpRabbitMQClientService } from "../services/noOpRabbitMQ.service";
import PublisherRabbitMQService from "../services/publisher.RabbitMQ.service";
import { PurchaseParcelStatusService } from '../services/PurchaseInwardOutWard.service';
import RabbitMQClientService from "../services/rabbitMQ.service";
import { SaleTransactionService } from "../services/saleTransaction.service";
import { SeriesService } from '../services/series.service';
import { Logger, WINSTON_LOGGER } from "./logger";
import FileService from "../providers/fileService.provider";
import { SaleTransactionProvider } from "../providers/saleTransaction.provider";

export const RABBITMQ_CLIENT_SERVICE = Symbol('RabbitMQClientService');
export const PUBLISHER_RABBITMQ_SERVICE = Symbol('PublisherRabbitMQService');
export const FEATURE_CONFIG_PATH = Symbol('FeatureConfigPath');

export async function registerDependencies(): Promise<void> {

  // Register Winston Logger
  container.register<ILogger>(WINSTON_LOGGER, {
    useFactory: () => {
      const loggerInstance = Logger.createLogger();
      return loggerInstance;
    }
  });

  // Register DataSourceService
  

  // 1. Register the manager as a singleton. It will be created once.
  container.registerSingleton(DataSourceManager);

  // 2. Resolve the manager to get the DataSource instances.
  const dataSourceManager = container.resolve(DataSourceManager);
  

  // 3. Register the actual DataSource instances for injection elsewhere.
  container.register(MAIN_DATA_SOURCE, { useValue: dataSourceManager.mainDataSource });
  container.register(PHOENIX_DATA_SOURCE, { useValue: dataSourceManager.phoenixDataSource });

  // Register FileService and its dependencies first, as FeaturesService depends on it.
  container.register<string>(FEATURE_CONFIG_PATH, { useValue: AppConfig.FEATURE_CONFIG_FILE_PATH });
  container.register(FileService, { useClass: FileService });
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
  container.register(AccountService, { useClass: AccountService });

  // Register CompanyProvider and CompanyService
  container.register(CompanyService, { useClass: CompanyService });

  // Register SeriesProvider and SeriesService
  container.register(SeriesService, { useClass: SeriesService });

  // Register Event Controller
  container.register(EventDrivenController, { useClass: EventDrivenController });

  container.register(PurchaseParcelStatusService, { useClass: PurchaseParcelStatusService });

  container.register(PurchasePipeLineController, { useClass: PurchasePipeLineController });

  // --- Register KotakCMSService and KotakCMSController ---

  // Register KotakCMSService
  container.register(KotakCMSService, { useClass: KotakCMSService });

  // Register KotakCMSController
  container.register(KotakCMSController, { useClass: KotakCMSController });

  // Register SaleTransactionProvider and SaleTransactionService
  container.register(SaleTransactionProvider, {useClass: SaleTransactionProvider})
  container.register(SaleTransactionService, { useClass: SaleTransactionService });
}
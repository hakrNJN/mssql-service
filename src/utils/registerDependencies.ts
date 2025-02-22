// src/utils/registerDependencies.ts
import { container, InjectionToken } from "tsyringe";
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
import { Logger, WINSTON_LOGGER } from "./logger";


// Define a token for FileService
export const FILE_SERVICE_TOKEN = Symbol('FileServiceToken') as InjectionToken<FileService>; 


export function registerDependencies(): void {

    
      // Register DataSourceService using useClass
      container.register(DataSourceService, { useClass: DataSourceService });

      // Register AppDataSource and PhoenixDataSource using useClass
      container.register(AppDataSource, { useClass: AppDataSource });
      container.register(PhoenixDataSource, { useClass: PhoenixDataSource });

    //register the rabbitMQClientService
    const rabbitMQConnectionUrl = { connectionUrl: AppConfig.RABBITMQ_BROCKER };
      container.register(RabbitMQClientService, {
          useFactory: (c) => new RabbitMQClientService(rabbitMQConnectionUrl, c.resolve(WINSTON_LOGGER)) 
      });
    
    //register the RabbitMQPublisherService
  container.register(PublisherRabbitMQService, {
    useFactory: (c) => new PublisherRabbitMQService(
      c.resolve(RabbitMQClientService),
      c.resolve(WINSTON_LOGGER))
  });
    
    //register the Event Controller
    container.register(EventDrivenController, {
      useFactory: (c) => new EventDrivenController(
          c.resolve(RabbitMQClientService),
          c.resolve(PublisherRabbitMQService),
          c.resolve(FeaturesService),
          c.resolve(WINSTON_LOGGER) 
      )
  });
     // Register Winston Logger
     container.register<winston.Logger>(WINSTON_LOGGER, {
        useFactory: () => Logger.createLogger() // Use the factory method
    });
}
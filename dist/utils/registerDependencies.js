"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDependencies = registerDependencies;
// src/utils/registerDependencies.ts
const path_1 = require("path"); // Import path
const tsyringe_1 = require("tsyringe");
const config_1 = require("../config/config");
const eventDriven_controller_1 = __importDefault(require("../controllers/eventDriven.controller"));
const kotakCMS_controller_1 = require("../controllers/kotakCMS.controller");
const purchasePipeLine_controller_1 = require("../controllers/purchasePipeLine.controller");
const data_source_provider_1 = require("../providers/data-source.provider");
const fileService_provider_1 = __importDefault(require("../providers/fileService.provider"));
const phoenix_data_source_provider_1 = require("../providers/phoenix.data-source.provider");
const dataSource_service_1 = require("../services/dataSource.service");
const feature_service_1 = __importDefault(require("../services/feature.service"));
const kotakCMS_service_1 = require("../services/kotakCMS.service");
const publisher_RabbitMQ_service_1 = __importDefault(require("../services/publisher.RabbitMQ.service"));
const purchaseInwardOutWard_service_1 = require("../services/purchaseInwardOutWard.service");
const rabbitMQ_service_1 = __importDefault(require("../services/rabbitMQ.service"));
const logger_1 = require("./logger");
// Define a token for FileService if you want to use interface injection.
// export const FILE_SERVICE_TOKEN = Symbol('FileServiceToken') as InjectionToken<FileService>; // Not strictly needed here
function registerDependencies() {
    // Register Winston Logger
    tsyringe_1.container.register(logger_1.WINSTON_LOGGER, {
        useFactory: () => {
            const loggerInstance = logger_1.Logger.createLogger();
            return loggerInstance;
        }
    });
    // Register DataSourceService
    tsyringe_1.container.register(dataSource_service_1.DataSourceService, { useClass: dataSource_service_1.DataSourceService });
    tsyringe_1.container.register(data_source_provider_1.AppDataSource, { useClass: data_source_provider_1.AppDataSource });
    tsyringe_1.container.register(phoenix_data_source_provider_1.PhoenixDataSource, { useClass: phoenix_data_source_provider_1.PhoenixDataSource });
    // Register RabbitMQClientService
    const rabbitMQConnectionUrl = { connectionUrl: config_1.AppConfig.RABBITMQ_BROCKER };
    tsyringe_1.container.register(rabbitMQ_service_1.default, {
        useFactory: (c) => new rabbitMQ_service_1.default(rabbitMQConnectionUrl, c.resolve(logger_1.WINSTON_LOGGER))
    });
    // Register RabbitMQPublisherService
    tsyringe_1.container.register(publisher_RabbitMQ_service_1.default, {
        useFactory: (c) => new publisher_RabbitMQ_service_1.default(c.resolve(rabbitMQ_service_1.default), c.resolve(logger_1.WINSTON_LOGGER))
    });
    // **Register FileService using a factory function:**
    tsyringe_1.container.register(fileService_provider_1.default, {
        useFactory: (c) => {
            const filePath = (0, path_1.join)(__dirname, '../config', 'feature.config.yml'); // Define filePath here, same as in FeaturesService
            return new fileService_provider_1.default(filePath, c.resolve(logger_1.WINSTON_LOGGER)); // Resolve logger from container
        }
    });
    tsyringe_1.container.register(feature_service_1.default, { useClass: feature_service_1.default });
    // Register FeaturesService (implicitly registered as it's injectable and singleton)
    // Register Event Controller
    tsyringe_1.container.register(eventDriven_controller_1.default, {
        useFactory: (c) => new eventDriven_controller_1.default(c.resolve(rabbitMQ_service_1.default), c.resolve(publisher_RabbitMQ_service_1.default), c.resolve(feature_service_1.default), c.resolve(logger_1.WINSTON_LOGGER))
    });
    tsyringe_1.container.register(purchaseInwardOutWard_service_1.PurchaseParcelStatusService, {
        useFactory: (c) => {
            const dataSourceInstance = c.resolve(data_source_provider_1.AppDataSource);
            const service = new purchaseInwardOutWard_service_1.PurchaseParcelStatusService(dataSourceInstance);
            return service;
        }
    });
    tsyringe_1.container.register(purchasePipeLine_controller_1.PurchasePipeLineController, {
        useFactory: (c) => new purchasePipeLine_controller_1.PurchasePipeLineController(c.resolve(purchaseInwardOutWard_service_1.PurchaseParcelStatusService))
    });
    // --- Register KotakCMSService and KotakCMSController ---
    // Register KotakCMSService
    tsyringe_1.container.register(kotakCMS_service_1.KotakCMSService, {
        useFactory: (c) => {
            const dataSourceInstance = c.resolve(data_source_provider_1.AppDataSource);
            const service = new kotakCMS_service_1.KotakCMSService(dataSourceInstance);
            return service;
        }
    });
    // Register KotakCMSController
    tsyringe_1.container.register(kotakCMS_controller_1.KotakCMSController, {
        useFactory: (c) => new kotakCMS_controller_1.KotakCMSController(c.resolve(kotakCMS_service_1.KotakCMSService))
    });
}

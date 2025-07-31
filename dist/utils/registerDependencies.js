"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUBLISHER_RABBITMQ_SERVICE = exports.RABBITMQ_CLIENT_SERVICE = void 0;
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
const account_service_1 = require("../services/account.service");
const kotakCMS_service_1 = require("../services/kotakCMS.service");
const publisher_RabbitMQ_service_1 = __importDefault(require("../services/publisher.RabbitMQ.service"));
const purchaseInwardOutWard_service_1 = require("../services/purchaseInwardOutWard.service");
const rabbitMQ_service_1 = __importDefault(require("../services/rabbitMQ.service"));
const noOpRabbitMQ_service_1 = require("../services/noOpRabbitMQ.service");
const noOpPublisherRabbitMQ_service_1 = require("../services/noOpPublisherRabbitMQ.service");
const logger_1 = require("./logger");
exports.RABBITMQ_CLIENT_SERVICE = Symbol('RabbitMQClientService');
exports.PUBLISHER_RABBITMQ_SERVICE = Symbol('PublisherRabbitMQService');
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
    // Register FeaturesService first, as it's needed for conditional registration
    tsyringe_1.container.register(feature_service_1.default, { useClass: feature_service_1.default });
    const featuresService = tsyringe_1.container.resolve(feature_service_1.default);
    // Temporarily load features to check the flag. This will be re-initialized in App.ts
    // In a real-world scenario, you might want a more robust way to access initial feature flags
    // without a full service initialization here, perhaps directly reading the config file.
    // For this exercise, we'll assume a quick sync read or a pre-loaded config.
    // For now, we'll rely on the fact that featuresService.getFeatures() will return the current state.
    const features = featuresService.getFeatures();
    const enableRabbitMQ = features.enableRabbitMQ;
    if (enableRabbitMQ) {
        // Register RabbitMQClientService
        const rabbitMQConnectionUrl = { connectionUrl: config_1.AppConfig.RABBITMQ_BROCKER };
        tsyringe_1.container.register(exports.RABBITMQ_CLIENT_SERVICE, {
            useFactory: (c) => new rabbitMQ_service_1.default(rabbitMQConnectionUrl, c.resolve(logger_1.WINSTON_LOGGER))
        });
        // Register RabbitMQPublisherService
        tsyringe_1.container.register(exports.PUBLISHER_RABBITMQ_SERVICE, {
            useFactory: (c) => new publisher_RabbitMQ_service_1.default(c.resolve(exports.RABBITMQ_CLIENT_SERVICE), c.resolve(logger_1.WINSTON_LOGGER))
        });
    }
    else {
        // Register No-Op RabbitMQClientService
        tsyringe_1.container.register(exports.RABBITMQ_CLIENT_SERVICE, {
            useFactory: (c) => new noOpRabbitMQ_service_1.NoOpRabbitMQClientService(c.resolve(logger_1.WINSTON_LOGGER))
        });
        // Register No-Op RabbitMQPublisherService
        tsyringe_1.container.register(exports.PUBLISHER_RABBITMQ_SERVICE, {
            useFactory: (c) => new noOpPublisherRabbitMQ_service_1.NoOpPublisherRabbitMQService(c.resolve(logger_1.WINSTON_LOGGER))
        });
    }
    // **Register FileService using a factory function:**
    tsyringe_1.container.register(fileService_provider_1.default, {
        useFactory: (c) => {
            const filePath = (0, path_1.join)(__dirname, '../config', 'feature.config.yml'); // Define filePath here, same as in FeaturesService
            return new fileService_provider_1.default(filePath, c.resolve(logger_1.WINSTON_LOGGER)); // Resolve logger from container
        }
    });
    // Register AccountService
    tsyringe_1.container.register(account_service_1.AccountService, {
        useFactory: (c) => {
            const dataSourceInstance = c.resolve(data_source_provider_1.AppDataSource);
            const service = new account_service_1.AccountService(dataSourceInstance);
            return service;
        }
    });
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

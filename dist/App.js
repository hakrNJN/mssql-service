"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tsyringe_1 = require("tsyringe");
const winston_1 = __importDefault(require("winston"));
const eventDriven_controller_1 = __importDefault(require("./controllers/eventDriven.controller"));
const feature_controller_1 = __importDefault(require("./controllers/feature.controller"));
const errorHandler_1 = require("./middleware/errorHandler");
const TimeTracker_middleware_1 = require("./middleware/TimeTracker.middleware");
const express_provider_1 = __importDefault(require("./providers/express.provider"));
const routes_1 = __importDefault(require("./routes"));
const dataSource_service_1 = require("./services/dataSource.service");
const feature_service_1 = __importDefault(require("./services/feature.service"));
const logger_1 = require("./utils/logger");
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
let App = class App {
    constructor(dataSourceService, logger, expressAppInstance, featuresService, eventDrivenController, featureController) {
        this.dataSourceService = dataSourceService;
        this.logger = logger;
        this.expressAppInstance = expressAppInstance;
        this.app = this.expressAppInstance.app;
        this.featuresService = featuresService;
        this.eventDrivenController = eventDrivenController;
        this.featureController = featureController;
        this.initControllers();
        // initializeRoutes(); // REMOVE from constructor - move to init()
        this.initializeErrorHandling(); // Keep error handling in constructor if it doesn't depend on featuresService
    }
    async init() {
        await this.featuresService.initialize(); // Initialize FeaturesService FIRST in init()
        this.initializeRoutes(); // THEN initialize routes - now it's guaranteed featuresService is ready
    }
    initControllers() {
        // The featureController is now injected directly into the App class constructor.
        // No need to instantiate or resolve it here.
        // this.app.use('/features', this.featureController.handleRequest);
    }
    initializeRoutes() {
        this.app.use('/api', TimeTracker_middleware_1.timeTrackerMiddleware, (0, routes_1.default)(this.dataSourceService, this.featuresService)); // Passing the instance variable here
    }
    async startEventListeners() {
        await this.eventDrivenController.initialize();
        if (this.featuresService.isFeatureEnabled('startListening')) {
            this.logger.info('startListening feature is enabled. Starting EventDrivenController listeners...');
            await this.eventDrivenController.startEventListeners();
        }
        else {
            this.logger.info('startListening feature is disabled. Skipping EventDrivenController listeners.');
        }
    }
    listen(port, callback) {
        this.app.listen(port, callback);
        this.startEventListeners();
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    getServer() {
        return this.app;
    }
};
exports.App = App;
exports.App = App = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __param(2, (0, tsyringe_1.inject)(express_provider_1.default)),
    __param(3, (0, tsyringe_1.inject)(feature_service_1.default)),
    __param(4, (0, tsyringe_1.inject)(eventDriven_controller_1.default)),
    __param(5, (0, tsyringe_1.inject)(feature_controller_1.default)),
    __metadata("design:paramtypes", [dataSource_service_1.DataSourceService, winston_1.default.Logger, express_provider_1.default,
        feature_service_1.default,
        eventDriven_controller_1.default,
        feature_controller_1.default])
], App);
// import { Application } from 'express';
// import { errorHandler } from './middleware/errorHandler';
// import ExpressApp from './providers/express.provider';
// import apiRoutes from './routes';
// import { Logger } from './utils/logger';
// class App {
//   public app: Application;
//   private logger = Logger.getInstance();
//   private expressAppInstance: ExpressApp;
//   constructor() {
//     this.expressAppInstance = new ExpressApp(); // Create instance here
//     this.app = this.expressAppInstance.app; // Access app from instance
//     this.initializeRoutes();
//     this.initializeErrorHandling();
//   }
//   private initializeRoutes(): void {
//     this.app.use('/api', apiRoutes);
//     // this.app.use('/api/test', new testRoutes().router); // Example route mounting
//   }
//   public listen(port: string | number, callback?: () => void): void {
//     this.app.listen(port, callback);
//   }
//   private initializeErrorHandling(): void {
//     this.app.use(errorHandler); // Assuming errorHandler is a function defined elsewhere
//   }
//   public getServer(): Application {
//     return this.app;
// }
// }
// export { App };

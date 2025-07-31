"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const App_1 = require("./App");
const config_1 = require("./config/config");
const dataSource_service_1 = require("./services/dataSource.service");
const registerDependencies_1 = require("./utils/registerDependencies");
const logger_1 = require("./utils/logger");
// Register all dependencies
(0, registerDependencies_1.registerDependencies)();
// Resolve the Winston Logger from the container
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
async function startServer() {
    const logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    try {
        const dataSourceService = tsyringe_1.container.resolve(dataSource_service_1.DataSourceService);
        const app = tsyringe_1.container.resolve(App_1.App);
        await app.init(); // Call app.init() to handle async initialization - This is crucial and correct
        app.listen(config_1.AppConfig.APP.PORT, () => {
            logger.info(`${config_1.AppConfig.APP.NAME} server is running on port ${config_1.AppConfig.APP.PORT} in ${config_1.AppConfig.APP.ENVIRONMENT} environment`);
        });
    }
    catch (error) {
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

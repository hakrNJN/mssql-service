"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/index.ts
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
const account_route_1 = __importDefault(require("./account.route"));
const company_route_1 = __importDefault(require("./company.route"));
const feature_route_1 = __importDefault(require("./feature.route"));
const saleTransaction_route_1 = __importDefault(require("./saleTransaction.route"));
const series_route_1 = __importDefault(require("./series.route"));
const test_route_1 = __importDefault(require("./test.route"));
const year_route_1 = __importDefault(require("./year.route"));
// Import your new route factory functions
const kotakCMS_route_1 = __importDefault(require("./kotakCMS.route")); // Corrected import path
const purchasePipeLine_route_1 = __importDefault(require("./purchasePipeLine.route")); // Corrected import path
const router = (0, express_1.Router)();
// Function to create apiRoutes and accept dataSourceService and featuresService
const apiRoutes = (dataSourceService, featuresService) => {
    const logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    try {
        router.use('/test', test_route_1.default);
        router.use('/year', (0, year_route_1.default)(dataSourceService.getAppDataSource()));
        router.use('/company', (0, company_route_1.default)(dataSourceService.getAppDataSource()));
        router.use('/series', (0, series_route_1.default)(dataSourceService.getAppDataSource()));
        router.use('/accounts', (0, account_route_1.default)(dataSourceService.getAppDataSource()));
        // Use purchasePipeLineRoute and pass AppDataSource
        router.use('/purchase-pipeline', (0, purchasePipeLine_route_1.default)(dataSourceService.getAppDataSource()));
        // Use kotakCMSRoute and pass AppDataSource
        router.use('/kotak-cms', (0, kotakCMS_route_1.default)(dataSourceService.getAppDataSource()));
        router.use('/transaction/sale/', (0, saleTransaction_route_1.default)(dataSourceService.getPhoenixDataSource()));
        // Load features and then create feature route
        featuresService.loadFeatures().then(() => {
            const features = featuresService.getFeatures();
            if (features.fetchDataEnabled) {
                logger.info("Fetch Data Feature is enabled!");
            }
            else {
                logger.info("Fetch Data Feature is disabled.");
            }
            router.use('/features', (0, feature_route_1.default)(featuresService));
            // other routes (e.use('/other', otherRoute()); )
        }).catch(error => {
            logger.error("Error loading feature flags:", error);
            // Handle error appropriately, maybe exit application if feature config is critical
        });
    }
    catch (error) {
        logger.error("Error mounting routes:", error);
    }
    return router;
};
exports.default = apiRoutes;
// import { Router } from 'express';
// import { Logger } from '../utils/logger';
// import companyRoute from './company.route';
// import testRoute from './test.route';
// import yearRoute from './year.route';
// const router: Router = Router(); // Create a main router
// const logger = Logger.getInstance();
// // Mount individual route files under specific paths
// try { // <--- ADD TRY-CATCH BLOCK
//     router.use('/test', testRoute); // Mount test routes at /api/test
//     router.use('/year', yearRoute); // mount year routes at /api/year
//     router.use('/company', companyRoute); // mount year routes at /api/year
// } catch (error) {
//     logger.error("Error mounting year routes:", error); // Log error if year routes fail to load
//     // Optionally, you might want to handle this error more gracefully,
//     // e.g., send an error response or prevent the server from starting fully.
// }
// export default router; //

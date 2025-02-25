//src/routes/index.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import winston from 'winston';
import { DataSourceService } from '../services/dataSource.service';
import FeaturesService from '../services/feature.service';
import { WINSTON_LOGGER } from '../utils/logger';
import accountRoute from './account.route';
import companyRoute from './company.route';
import featureRoute from './feature.route';
import saleTransactionRoute from './saleTransaction.route';
import seriesRoute from './series.route';
import testRoute from './test.route';
import yearRoute from './year.route';

const router: Router = Router();
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
// const featuresService = new FeaturesService(); // REMOVE THIS LINE - INCORRECT INSTANTIATION

// Function to create apiRoutes and accept dataSource
// const apiRoutes = (dataSource: AppDataSource, dataSource2 : PhoenixDataSource): Router => {
const apiRoutes = (dataSourceService: DataSourceService, featuresService: FeaturesService): Router => { // ADD featuresService as argument
    const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);

    try {
        router.use('/test', testRoute);
        router.use('/year', yearRoute(dataSourceService.getAppDataSource())); // Pass dataSource to yearRoute
        router.use('/company', companyRoute(dataSourceService.getAppDataSource()));
        router.use('/series', seriesRoute(dataSourceService.getAppDataSource()));
        router.use('/accounts', accountRoute(dataSourceService.getAppDataSource()));
        router.use('/transaction/sale/', saleTransactionRoute(dataSourceService.getPhoenixDataSource()));


        // Load features and then create feature route
        featuresService.loadFeatures().then(() => { // USE the featuresService PASSED as argument
            const features = featuresService.getFeatures();
            if (features.fetchDataEnabled) {
                logger.info("Fetch Data Feature is enabled!"); // Use your logger
            } else {
                logger.info("Fetch Data Feature is disabled."); // Use your logger
            }

            router.use('/features', featureRoute(featuresService)); // Pass FeaturesService instance to featureRoute

            // other routes (e.g., router.use('/other', otherRoute()); )

        }).catch(error => {
            logger.error("Error loading feature flags:", error); // Log error if feature loading fails
            // Handle error appropriately, maybe exit application if feature config is critical
        });
    } catch (error) {
        logger.error("Error mounting routes:", error);
    }
    return router;
};


export default apiRoutes;

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
//src/routes/index.ts
import { Router } from 'express';
import { container } from 'tsyringe';
// No direct winston import needed here if ILogger is used
import { ILogger } from '../interface/logger.interface';
import { DataSourceService } from '../services/dataSource.service';
import FeaturesService from '../services/feature.service';
import { WINSTON_LOGGER } from '../utils/logger';
import accountRoute from './account.route';
import companyRoute from './company.route';
import featureRoute from './feature.route';
import saleTransactionRoute from './saleTransaction.route';
import seriesRoute from './series.route';
import yearRoute from './year.route';

// Import your new route factory functions
import kotakCMSRoute from './kotakCMS.route';
import purchasePipeLineRoute from './purchasePipeLine.route'; // Corrected import path


const router: Router = Router();

// Function to create apiRoutes and accept dataSourceService and featuresService
const apiRoutes = (dataSourceService: DataSourceService, featuresService: FeaturesService): Router => {
    const logger = container.resolve<ILogger>(WINSTON_LOGGER);

    try {

        router.use('/year', yearRoute());
        router.use('/company', companyRoute());
        router.use('/series', seriesRoute());
        router.use('/accounts', accountRoute());

        // Use purchasePipeLineRoute and pass AppDataSource
        router.use('/purchase-pipeline', purchasePipeLineRoute());

        // Use kotakCMSRoute and pass AppDataSource
        router.use('/kotak-cms', kotakCMSRoute());

        router.use('/transaction/sale/', saleTransactionRoute());


        // Load features and then create feature route
        featuresService.loadFeatures().then(() => {
            const features = featuresService.getFeatures();
            if (features.fetchDataEnabled) {
                logger.info("Fetch Data Feature is enabled!");
            } else {
                logger.info("Fetch Data Feature is disabled.");
            }

            router.use('/features', featureRoute());

            // other routes (e.use('/other', otherRoute()); )

        }).catch(error => {
            logger.error("Error loading feature flags:", error);
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
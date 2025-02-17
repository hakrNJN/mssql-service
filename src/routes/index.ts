//src/routes/index.ts
import { Router } from 'express';
import path from 'path';
import { AppDataSource } from '../providers/data-source.provider'; // Import AppDataSource
import FeaturesService from '../services/feature.service';
import { Logger } from '../utils/logger';
import accountRoute from './account.route';
import companyRoute from './company.route';
import featureRoute from './feature.route';
import seriesRoute from './series.route';
import testRoute from './test.route';
import yearRoute from './year.route';

const router: Router = Router();
const logger = Logger.getInstance();
const featuresService = new FeaturesService(path.join(__dirname, '../config'));

// Function to create apiRoutes and accept dataSource
const apiRoutes = (dataSource: AppDataSource): Router => {
    try {
        router.use('/test', testRoute);
        router.use('/year', yearRoute(dataSource)); // Pass dataSource to yearRoute
        router.use('/company', companyRoute(dataSource));
        router.use('/series', seriesRoute(dataSource));
        router.use('/accounts', accountRoute(dataSource));
        
        
        // Load features and then create feature route
        featuresService.loadFeatures().then(() => {
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
//src/routes/index.ts
import { Router } from 'express';
import { AppDataSource } from '../providers/data-source.provider'; // Import AppDataSource
import { Logger } from '../utils/logger';
import accountRoute from './account.route';
import companyRoute from './company.route';
import seriesRoute from './series.route';
import testRoute from './test.route';
import yearRoute from './year.route';

const router: Router = Router();
const logger = Logger.getInstance();

// Function to create apiRoutes and accept dataSource
const apiRoutes = (dataSource: AppDataSource): Router => {
    try {
        router.use('/test', testRoute);
        router.use('/year', yearRoute(dataSource)); // Pass dataSource to yearRoute
        router.use('/company', companyRoute(dataSource));
        router.use('/series', seriesRoute(dataSource));
        router.use('/accounts', accountRoute(dataSource));
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
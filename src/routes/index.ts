import { Router } from 'express';
import { Logger } from '../utils/logger';
import testRoute from './test.route';
import yearRoute from './year.route';

const router: Router = Router(); // Create a main router
const logger = Logger.getInstance(); 

// Mount individual route files under specific paths
try { // <--- ADD TRY-CATCH BLOCK
    router.use('/test', testRoute); // Mount test routes at /api/test
    router.use('/year', yearRoute); // mount year routes at /api/year
} catch (error) {
    logger.error("Error mounting year routes:", error); // Log error if year routes fail to load
    // Optionally, you might want to handle this error more gracefully,
    // e.g., send an error response or prevent the server from starting fully.
}


export default router; //
// src/routes/KotakCMS.routes.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { KotakCMSController } from '../controllers/KotakCMS.controller';

const kotakCMSRoute = (): Router => {
    const router: Router = Router();

    // const kotakCMSService = new KotakCMSService(dataSource);
    // kotakCMSService.initialize();

    // const kotakCMSController = new KotakCMSController(kotakCMSService);
    const kotakCMSController = container.resolve(KotakCMSController);

    // Route for getting all Kotak CMS records with filters
    // Now requires Conum, Yearid, and either date range or Vno range.
    // Example: GET /api/kotak-cms?Conum=ABC&Yearid=2024&fromDate=2023-01-01&toDate=2023-01-31
    // Example: GET /api/kotak-cms?Conum=ABC&Yearid=2024&fromVno=100&toVno=200
    router.get('/', kotakCMSController.getAllKotakCMS);

    // Removed the router.get('/:id', kotakCMSController.getKotakCMSById); route

    return router;
}

export default kotakCMSRoute;
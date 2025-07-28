// src/routes/purchasePipeLine.routes.ts
import { Router } from 'express';
import { PurchasePipeLineController } from '../controllers/purchasePipeLine.controller';
import { PurchaseParcelStatusService } from '../services/PurchaseInwardOutWard.service'; // Corrected service path/name
import { AppDataSource } from '../providers/data-source.provider'; // Import AppDataSource

// Define the route factory function
const purchasePipeLineRoute = (dataSource: AppDataSource): Router => {
    const router: Router = Router();

    // Initialize PurchaseParcelStatusService with the provided dataSource
    const purchaseParcelStatusService = new PurchaseParcelStatusService(dataSource);
    // Call initialize method for the service to set up its repository
    purchaseParcelStatusService.initialize(); // Assuming this is sync or safely handled. Consider awaiting if needed.

    // Initialize PurchasePipeLineController with the initialized service
    const purchasePipeLineController = new PurchasePipeLineController(purchaseParcelStatusService);

    // Route for getting all entries with filters (joined view)
    router.get('/entries', purchasePipeLineController.getEntriesByFilter);

    // Route for getting a single PurchasePipeLine entry by its composite key
    router.get('/entry/:purTrnId', purchasePipeLineController.getEntryById);

    // Route for inserting a new PurchasePipeLine entry
    router.post('/entry', purchasePipeLineController.insertEntry);

    // Route for updating an existing PurchasePipeLine entry
    router.put('/entry/:purTrnId/', purchasePipeLineController.updateEntry);

    return router;
}

export default purchasePipeLineRoute;
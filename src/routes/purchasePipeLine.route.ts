// src/routes/purchasePipeLine.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { PurchasePipeLineController } from '../controllers/purchasePipeLine.controller';

// Define the route factory function
const purchasePipeLineRoute = (): Router => {
    const router: Router = Router();

    const purchasePipeLineController = container.resolve(PurchasePipeLineController);

    // Route for getting all entries with filters (joined view)
    router.get('/purchase-parcel-status', (req, res, next) => purchasePipeLineController.getPurchaseParcelStatus(req, res, next));

    // Route for inserting a new PurchasePipeLine entry
    router.post('/purchase-pipeline', (req, res, next) => purchasePipeLineController.createPurchasePipeLine(req, res, next));

    // Route for updating an existing PurchasePipeLine entry
    router.put('/purchase-pipeline/:id', (req, res, next) => purchasePipeLineController.updatePurchasePipeLine(req, res, next));

    return router;
}

export default purchasePipeLineRoute;
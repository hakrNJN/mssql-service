"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/purchasePipeLine.routes.ts
const express_1 = require("express");
const purchasePipeLine_controller_1 = require("../controllers/purchasePipeLine.controller");
const purchaseInwardOutWard_service_1 = require("../services/purchaseInwardOutWard.service"); // Corrected service path/name
// Define the route factory function
const purchasePipeLineRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    // Initialize PurchaseParcelStatusService with the provided dataSource
    const purchaseParcelStatusService = new purchaseInwardOutWard_service_1.PurchaseParcelStatusService(dataSource);
    // Call initialize method for the service to set up its repository
    purchaseParcelStatusService.initialize(); // Assuming this is sync or safely handled. Consider awaiting if needed.
    // Initialize PurchasePipeLineController with the initialized service
    const purchasePipeLineController = new purchasePipeLine_controller_1.PurchasePipeLineController(purchaseParcelStatusService);
    // Route for getting all entries with filters (joined view)
    router.get('/entries', purchasePipeLineController.getEntriesByFilter);
    // Route for getting a single PurchasePipeLine entry by its composite key
    router.get('/entry/:purTrnId', purchasePipeLineController.getEntryById);
    // Route for inserting a new PurchasePipeLine entry
    router.post('/entry', purchasePipeLineController.insertEntry);
    // Route for updating an existing PurchasePipeLine entry
    router.put('/entry/:purTrnId/', purchasePipeLineController.updateEntry);
    return router;
};
exports.default = purchasePipeLineRoute;

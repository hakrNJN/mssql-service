"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/saleTransaction.route.ts
const express_1 = require("express");
const saleTransaction_controller_1 = require("../controllers/saleTransaction.controller");
const saleTransaction_service_1 = require("../services/saleTransaction.service");
// Adjust path if needed
const saleTransactionRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    // Initialize YearService with dataSource
    const saleTransactionService = new saleTransaction_service_1.SaleTransactionService(dataSource);
    saleTransactionService.initialize(); // Initialize YearService (repository)
    // Create YearController instance with the initialized YearService
    const saleTransactionController = new saleTransaction_controller_1.SaleTransactionController(saleTransactionService);
    // Define routes here, calling controller methods
    router.get('/:id', saleTransactionController.getTransactionById);
    return router; // Return the router
};
exports.default = saleTransactionRoute;

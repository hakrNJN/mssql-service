"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/account.route.ts
const express_1 = require("express");
const account_controller_1 = require("../controllers/account.controller");
const account_service_1 = require("../services/account.service");
// Adjust path if needed
const accountRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    // Initialize AccountService with dataSource
    const accountService = new account_service_1.AccountService(dataSource);
    accountService.initialize();
    const accountController = new account_controller_1.AccountController(accountService);
    router.get('/', accountController.getAllAccounts);
    router.get('/transports', accountController.getAllTransporters);
    router.get('/customers', accountController.getAllCustomers);
    router.get('/agents', accountController.getAllAgents);
    router.get('/id/:id', accountController.getAccountById);
    router.get('/agent/:id', accountController.getAgentWithCustomers);
    router.get('/customer/gst/:gst', accountController.getCustomerByGST);
    return router;
};
exports.default = accountRoute;

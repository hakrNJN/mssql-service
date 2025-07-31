"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/KotakCMS.routes.ts
const express_1 = require("express");
const kotakCMS_controller_1 = require("../controllers/kotakCMS.controller");
const kotakCMS_service_1 = require("../services/kotakCMS.service");
const kotakCMSRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    const kotakCMSService = new kotakCMS_service_1.KotakCMSService(dataSource);
    kotakCMSService.initialize();
    const kotakCMSController = new kotakCMS_controller_1.KotakCMSController(kotakCMSService);
    // Route for getting all Kotak CMS records with filters
    // Now requires Conum, Yearid, and either date range or Vno range.
    // Example: GET /api/kotak-cms?Conum=ABC&Yearid=2024&fromDate=2023-01-01&toDate=2023-01-31
    // Example: GET /api/kotak-cms?Conum=ABC&Yearid=2024&fromVno=100&toVno=200
    router.get('/', kotakCMSController.getAllKotakCMS);
    // Removed the router.get('/:id', kotakCMSController.getKotakCMSById); route
    return router;
};
exports.default = kotakCMSRoute;

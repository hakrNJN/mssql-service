"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/year.route.ts
const express_1 = require("express");
const series_controller_1 = require("../controllers/series.controller");
const series_service_1 = require("../services/series.service");
// Adjust path if needed
const seriesRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    // Initialize YearService with dataSource
    const seriesService = new series_service_1.SeriesService(dataSource);
    seriesService.initialize(); // Initialize YearService (repository)
    // Create YearController instance with the initialized YearService
    const seriesController = new series_controller_1.SeriesController(seriesService);
    // Define routes here, calling controller methods
    router.get('/', seriesController.getAllSeries);
    router.get('/getirnseries', seriesController.getIrnSeries);
    router.get('/:id', seriesController.getSeriesById);
    return router; // Return the router
};
exports.default = seriesRoute;

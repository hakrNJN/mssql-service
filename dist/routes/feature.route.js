"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/feature.route.ts
const express_1 = require("express");
const feature_controller_1 = __importDefault(require("../controllers/feature.controller"));
const featureRoute = (featuresService) => {
    const router = (0, express_1.Router)();
    const featureController = new feature_controller_1.default(featuresService);
    router.all('/features', featureController.handleRequest);
    return router;
};
exports.default = featureRoute;

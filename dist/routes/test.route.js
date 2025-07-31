"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
// Adjust path if needed
class TestRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.testController = new test_controller_1.TestController(); // Create an instance of the controller
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Define your routes here, calling controller methods
        // GET /api/test/
        this.router.get('/', this.testController.getAllTests);
        // // GET /api/test/:id
        // this.router.get('/:id', this.testController.getTestById);
        // // POST /api/test/
        // this.router.post('/', this.testController.createTest);
        // // PUT /api/test/:id
        // this.router.put('/:id', this.testController.updateTest);
        // // DELETE /api/test/:id
        // this.router.delete('/:id', this.testController.deleteTest);
    }
}
exports.default = new TestRoutes().router; // Export the router instance

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/companu.route.ts
const express_1 = require("express");
const company_controller_1 = require("../controllers/company.controller");
const company_service_1 = require("../services/company.service");
// Adjust path if needed
const companyRoute = (dataSource) => {
    const router = (0, express_1.Router)();
    // Initialize Company Service with dataSource
    const companyService = new company_service_1.CompanyService(dataSource);
    companyService.initialize();
    const companyController = new company_controller_1.CompanyController(companyService);
    router.get('/', companyController.getCompanies);
    router.get('/id/:id', companyController.getCompanyById);
    router.get('/gstin/:gstin', companyController.getCompanyByGSTIN);
    return router;
};
exports.default = companyRoute;
// class CompanyRoutes {
//   public router: Router;
//   private companyController : CompanyController; // Instantiate the controller
//   constructor() {
//     this.router = Router();
//     // Initialize AppDataSource (Ideally this should be done globally at app startup)
//     const dataSourceInstance = new AppDataSource();
//     dataSourceInstance.init(); // Initialize DataSource
//     // Initialize YearService with dataSourceInstance
//     const companyService = new CompanyService(dataSourceInstance);
//     companyService.initialize(); // Initialize YearService (repository)
//     // Create YearController instance with the initialized YearService
//     this.companyController = new CompanyController(companyService);
//     // this.yearController = new YearController();
//     this.initializeRoutes();
// }
//   private initializeRoutes(): void {
// // Define your routes here, calling controller methods
//       this.router.get('/', this.companyController.getCompanies);
//       this.router.get('/id/:id', this.companyController.getCompanyById);
//       this.router.get('/gstin/:gstin', this.companyController.getCompanyByGSTIN);
//     }
// }
// export default new CompanyRoutes().router; // Export the router instance

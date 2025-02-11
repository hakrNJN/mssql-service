//src/routes/year.route.ts
import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { AppDataSource } from '../providers/data-source.provider';
import { CompanyService } from '../services/company.service';

// Adjust path if needed

const companyRoute = (dataSource: AppDataSource): Router => {
  const router: Router = Router();

    // Initialize YearService with dataSource
  const companyService = new CompanyService(dataSource);
  companyService.initialize(); 

  const companyController = new CompanyController(companyService);

  router.get('/', companyController.getCompanies);
      router.get('/id/:id', companyController.getCompanyById);
  router.get('/gstin/:gstin', companyController.getCompanyByGSTIN);
  
  return router;
}

export default companyRoute
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

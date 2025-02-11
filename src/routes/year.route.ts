//src/routes/year.route.ts
import { Router } from 'express';
import { YearController } from '../controllers/year.controller';
import { AppDataSource } from '../providers/data-source.provider';
import { YearService } from '../services/years.service';

// Adjust path if needed

const yearRoute = (dataSource: AppDataSource): Router => { // Accept dataSource as argument
  const router: Router = Router();

  // Initialize YearService with dataSource
  const yearService = new YearService(dataSource);
  yearService.initialize(); // Initialize YearService (repository)

  // Create YearController instance with the initialized YearService
  const yearController = new YearController(yearService);

  // Define routes here, calling controller methods
  router.get('/', yearController.getYears);
  router.get('/:id', yearController.getYearById);

  return router; // Return the router
};

export default yearRoute;

//src/routes/year.route.ts
// import { Router } from 'express';
// import { YearController } from '../controllers/year.controller';
// import { AppDataSource } from '../providers/data-source.provider';
// import { YearService } from '../services/years.service';

// // Adjust path if needed

// class YearRoutes {
//   public router: Router;
//   private yearController: YearController; // Instantiate the controller

//   constructor() {
//     this.router = Router();

//     // Initialize AppDataSource (Ideally this should be done globally at app startup)
//     const dataSourceInstance = new AppDataSource();
    
//     dataSourceInstance.init(); // Initialize DataSource

//     // Initialize YearService with dataSourceInstance
//     const yearService = new YearService(dataSourceInstance);
//     yearService.initialize(); // Initialize YearService (repository)

//     // Create YearController instance with the initialized YearService
//     this.yearController = new YearController(yearService);
//     // this.yearController = new YearController();
//     this.initializeRoutes();
// }

//   private initializeRoutes(): void {
// // Define your routes here, calling controller methods
      
//       this.router.get('/', this.yearController.getYears);
//       this.router.get('/:id', this.yearController.getYearById);
      
//     }
// }

// export default new YearRoutes().router; // Export the router instance

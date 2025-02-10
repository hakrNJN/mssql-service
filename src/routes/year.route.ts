//src/routes/year.route.ts
import { Router } from 'express';
import { YearController } from '../controllers/year.controller';
import { AppDataSource } from '../providers/data-source.provider';
import { YearService } from '../services/years.service';

// Adjust path if needed

class TestRoutes {
  public router: Router;
  private yearController: YearController; // Instantiate the controller

  constructor() {
    this.router = Router();

    // Initialize AppDataSource (Ideally this should be done globally at app startup)
    const dataSourceInstance = new AppDataSource();
    dataSourceInstance.init(); // Initialize DataSource

    // Initialize YearService with dataSourceInstance
    const yearService = new YearService(dataSourceInstance);
    yearService.initialize(); // Initialize YearService (repository)

    // Create YearController instance with the initialized YearService
    this.yearController = new YearController(yearService);
    // this.yearController = new YearController();
    this.initializeRoutes();
}

  private initializeRoutes(): void {
// Define your routes here, calling controller methods
      
      this.router.get('/', this.yearController.getYears);
      this.router.get('/:id', this.yearController.getYearById);
      
    }
}

export default new TestRoutes().router; // Export the router instance

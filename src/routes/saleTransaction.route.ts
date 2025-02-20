//src/routes/year.route.ts
import { Router } from 'express';
import { SaleTransactionController } from '../controllers/saleTransaction.controller';
import { PhoenixDataSource } from '../providers/phoenix.data-source.provider';
import { SaleTransactionService } from '../services/saleTransaction.service';

// Adjust path if needed

const saleTransactionRoute = (dataSource: PhoenixDataSource): Router => { // Accept dataSource as argument
  const router: Router = Router();

  // Initialize YearService with dataSource
  const saleTransactionService = new SaleTransactionService(dataSource);
  saleTransactionService.initialize(); // Initialize YearService (repository)

  // Create YearController instance with the initialized YearService
  const saleTransactionController = new SaleTransactionController(saleTransactionService);

  // Define routes here, calling controller methods

  router.get('/:id', saleTransactionController.getTransactionById);

  return router; // Return the router
};

export default saleTransactionRoute;
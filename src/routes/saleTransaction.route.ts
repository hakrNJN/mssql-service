//src/routes/saleTransaction.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { SaleTransactionController } from '../controllers/saleTransaction.controller';

// Adjust path if needed

const saleTransactionRoute = (): Router => { // Accept dataSource as argument
  const router: Router = Router();

  // Initialize YearService with dataSource
  // const saleTransactionService = new SaleTransactionService(dataSource);
  // saleTransactionService.initialize(); // Initialize YearService (repository)

  // // Create YearController instance with the initialized YearService
  // const saleTransactionController = new SaleTransactionController(saleTransactionService);

  const saleTransactionController = container.resolve(SaleTransactionController);

  // Define routes here, calling controller methods

  router.get('/:id', saleTransactionController.getTransactionById);

  return router; // Return the router
};

export default saleTransactionRoute;
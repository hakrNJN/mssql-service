//src/routes/account.route.ts
import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { AppDataSource } from '../providers/data-source.provider';
import { AccountService } from '../services/account.service';

// Adjust path if needed

const accountRoute = (dataSource: AppDataSource): Router => {
    const router: Router = Router();

    // Initialize AccountService with dataSource
    const accountService = new AccountService(dataSource);
    accountService.initialize();

    const accountController = new AccountController(accountService);

    router.get('/', accountController.getAllAccounts);
    router.get('/transports', accountController.getAllTransporters);
    router.get('/customers', accountController.getAllCustomers);
    router.get('/agents', accountController.getAllAgents);
    router.get('/id/:id', accountController.getAccountById);
    router.get('/agent/:id', accountController.getAgentWithCustomers);
    router.get('/customer/gst/:gst', accountController.getCustomerByGST);

    return router;
}

export default accountRoute
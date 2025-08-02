//src/routes/account.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { AccountController } from '../controllers/account.controller';

// Adjust path if needed

const accountRoute = (): Router => {
    const router: Router = Router();

    // Initialize AccountService with dataSource
    // const accountService = new AccountService(dataSource);
    // accountService.initialize();

    // const accountController = new AccountController(accountService);

    const accountController = container.resolve(AccountController);

    router.get('/all', accountController.getAllAccounts);
    router.get('/transports', accountController.getAllTransporters);
    router.get('/customers', accountController.getAllCustomers);
    router.get('/agents', accountController.getAllAgents);
    router.get('/id/:id', accountController.getAccountById);
    router.get('/agent/:id', accountController.getAgentWithCustomers);
    router.get('/customer/gst/:gst', accountController.getCustomerByGST);

    return router;
}

export default accountRoute
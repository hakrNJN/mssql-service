import { Request, Response } from 'express';
import { SaleTransactionService } from '../services/saleTransaction.service';
export declare class SaleTransactionController {
    private saleTransactionService;
    constructor(saleTransactionService: SaleTransactionService);
    getTransactionById: (req: Request, res: Response) => Promise<void>;
}

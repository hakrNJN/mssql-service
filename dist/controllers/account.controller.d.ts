import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';
export interface AccountController {
    stringToArray(str: string): number[];
}
export declare class AccountController {
    private accountService;
    constructor(accountService: AccountService);
    getAllAccounts: (req: Request, res: Response) => Promise<void>;
    getAllCustomers: (req: Request, res: Response) => Promise<void>;
    getAllAgents: (req: Request, res: Response) => Promise<void>;
    getAllTransporters: (req: Request, res: Response) => Promise<void>;
    getAccountById: (req: Request, res: Response) => Promise<void>;
    getCustomerByGST: (req: Request, res: Response) => Promise<void>;
    getAgentWithCustomers: (req: Request, res: Response) => Promise<void>;
}

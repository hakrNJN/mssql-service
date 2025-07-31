import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
export declare class CompanyController {
    private companyService;
    constructor(companyService: CompanyService);
    getCompanies: (req: Request, res: Response) => Promise<void>;
    getCompanyById: (req: Request, res: Response) => Promise<void>;
    getCompanyByGSTIN: (req: Request, res: Response) => Promise<void>;
}

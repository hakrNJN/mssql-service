import { Request, Response } from 'express';
import { YearService } from '../services/years.service';
export declare class YearController {
    private yearService;
    constructor(yearService: YearService);
    getYears: (req: Request, res: Response) => Promise<void>;
    getYearById: (req: Request, res: Response) => Promise<void>;
}

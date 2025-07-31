import { Request, Response } from 'express';
import { PurchaseParcelStatusService } from '../services/purchaseInwardOutWard.service';
export interface PurchasePipeLineController {
}
export declare class PurchasePipeLineController {
    private purchaseParcelStatusService;
    constructor(purchaseParcelStatusService: PurchaseParcelStatusService);
    getEntriesByFilter: (req: Request, res: Response) => Promise<void>;
    getEntryById: (req: Request, res: Response) => Promise<void>;
    insertEntry: (req: Request, res: Response) => Promise<void>;
    updateEntry: (req: Request, res: Response) => Promise<void>;
}

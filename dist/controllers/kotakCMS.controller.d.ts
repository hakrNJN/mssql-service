import { Request, Response } from 'express';
import { KotakCMSService } from '../services/kotakCMS.service';
export declare class KotakCMSController {
    private kotakCMSService;
    private logger;
    constructor(kotakCMSService: KotakCMSService);
    getAllKotakCMS: (req: Request, res: Response) => Promise<void>;
}

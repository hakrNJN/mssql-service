import { Request, Response } from 'express';
export declare class TestController {
    private logger;
    constructor();
    getAllTests: (req: Request, res: Response) => Promise<void>;
}

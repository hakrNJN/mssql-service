import { NextFunction, Request, Response } from 'express';
import { IFeatureController } from '../interface/feature.interface';
import FeaturesService from '../services/feature.service';
declare class FeatureController implements IFeatureController {
    #private;
    private featuresService;
    private handlers;
    constructor(featuresService: FeaturesService);
    handleRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default FeatureController;

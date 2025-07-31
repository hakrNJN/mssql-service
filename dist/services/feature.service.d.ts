import winston from 'winston';
import { FeatureConfig, IFeaturesService, IFileService } from '../interface/feature.interface';
declare class FeaturesService implements IFeaturesService {
    fileService: IFileService;
    private features;
    private filePath;
    private readonly logger;
    constructor(fileService: IFileService, // Inject IFileService
    logger: winston.Logger);
    initialize(): Promise<void>;
    private initializeFileWatcher;
    private reloadFeatures;
    loadFeatures(): Promise<void>;
    getFeatures(): FeatureConfig;
    isFeatureEnabled(featureName: string): boolean;
}
export default FeaturesService;

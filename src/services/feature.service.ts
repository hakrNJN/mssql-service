import { join } from 'path';
import { AppError } from '../exceptions/appException';
import { FeatureConfig, IFeaturesService, IFileService } from '../interface/feature.interface';
import FileService from '../providers/fileService.provider';

class FeaturesService implements IFeaturesService {
    public fileService: IFileService; // Use interface
    private features: FeatureConfig = {};

    constructor(filePath: string) {
        this.fileService = new FileService(join(__dirname, filePath, 'feature.config.yml'));
        this.features = {};
    }

    async loadFeatures(): Promise<void> {
        try {
            await this.fileService.initialize();
            this.features = this.fileService.model.read();
        } catch (error: any) {
            console.error('Error loading features in FeaturesService:', error);
            throw new AppError( 500,"Unable to load features configuration");
        }
    }

    getFeatures(): FeatureConfig {
        return this.features;
    }
}

export default FeaturesService;
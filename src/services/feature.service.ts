//src/services/feature.service.ts
import * as fs from 'fs';
import { join } from 'path';
import { inject, injectable, singleton } from 'tsyringe'; // Import 'inject'
import winston from 'winston';
import { AppError } from '../exceptions/appException';
import { FeatureConfig, IFeaturesService, IFileService } from '../interface/feature.interface';
import FileService from '../providers/fileService.provider'; // Keep import for type, or remove if only using interface
import { WINSTON_LOGGER } from '../utils/logger';

@injectable()
@singleton()
class FeaturesService implements IFeaturesService {
    public fileService: IFileService; // Use the interface
    private features: FeatureConfig = {};
    private filePath: string;
    private readonly logger: winston.Logger;

    constructor(
        @inject(FileService) fileService: IFileService, // Inject IFileService
        @inject(WINSTON_LOGGER) logger: winston.Logger // Inject Logger
    ) {
        this.filePath = join(__dirname, '../config', 'feature.config.yml');
        this.fileService = fileService;
        this.features = {};
        this.logger = logger;         // Assign logger FIRST
        console.log("FeaturesService constructor - Logger injected:", this.logger); 
        this.initializeFileWatcher(); // Then call initializeFileWatcher, logger will be defined
    }

    async initialize(): Promise<void> {
        await this.loadFeatures();
    }

    private initializeFileWatcher(): void {
        console.log(this.filePath)
        fs.watchFile(this.filePath, { interval: 1000 }, async (curr, prev) => {
            if (curr.mtimeMs !== prev.mtimeMs) {
                this.logger.info('Feature config file changed. Reloading features...');
                try {
                    await this.reloadFeatures();
                    this.logger.info('Features reloaded successfully.');
                } catch (error) {
                    this.logger.error('Error reloading features after file change:', error);
                }
            }
        });
        this.logger.info(`Watching for changes in feature config file: ${this.filePath}`);
    }


    private async reloadFeatures(): Promise<void> {
        try {
            await this.fileService.initialize();
            this.features = this.fileService.model.read();
        } catch (error: any) {
            this.logger.error('Error reloading features in FeaturesService:', error);
            throw new AppError(500, "Unable to reload features configuration");
        }
    }

    async loadFeatures(): Promise<void> {
        try {
            await this.fileService.initialize();
            this.features = this.fileService.model.read();
        } catch (error: any) {
            this.logger.error('Error loading features in FeaturesService:', error);
            throw new AppError(500, "Unable to load features configuration");
        }
    }

    getFeatures(): FeatureConfig {
        return this.features;
    }

    isFeatureEnabled(featureName: string): boolean {
        return !!this.features[featureName];
    }
}

export default FeaturesService;
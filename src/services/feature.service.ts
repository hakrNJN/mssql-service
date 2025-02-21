//src/services/feature.service.ts
import * as fs from 'fs'; // Import the 'fs' module for file watching
import { join } from 'path';
import { injectable, singleton } from 'tsyringe'; // Import Tsyringe decorators
import { AppError } from '../exceptions/appException';
import { FeatureConfig, IFeaturesService, IFileService } from '../interface/feature.interface';
import FileService from '../providers/fileService.provider';

@injectable() // Mark as injectable
@singleton()  // Register as a singleton in container
class FeaturesService implements IFeaturesService {
    public fileService: IFileService;
    private features: FeatureConfig = {};
    private filePath: string;

    constructor() { // Remove filePath from constructor, handle in initialize
        this.filePath = join(__dirname, '../config', 'feature.config.yml'); // Define filePath here
        this.fileService = new FileService(this.filePath);
        this.features = {};
        this.initializeFileWatcher(); // Start watching the file
    }

    async initialize(): Promise<void> { // Initialize method to be called once on startup
        await this.loadFeatures();
    }

    private initializeFileWatcher(): void {
        fs.watchFile(this.filePath, { interval: 1000 }, async (curr, prev) => { // Check every second
            if (curr.mtimeMs !== prev.mtimeMs) { // File modified
                console.log('Feature config file changed. Reloading features...');
                try {
                    await this.reloadFeatures();
                    console.log('Features reloaded successfully.');
                    // Optionally, publish an event to notify other parts of the app about feature flag changes
                } catch (error) {
                    console.error('Error reloading features after file change:', error);
                }
            }
        });
        console.log(`Watching for changes in feature config file: ${this.filePath}`);
    }


    private async reloadFeatures(): Promise<void> { // Separate reload logic
        try {
            await this.fileService.initialize(); // Re-initialize FileService to read fresh data
            this.features = this.fileService.model.read();
        } catch (error: any) {
            console.error('Error reloading features in FeaturesService:', error);
            throw new AppError(500, "Unable to reload features configuration");
        }
    }

    async loadFeatures(): Promise<void> { // Initial load (called once on startup)
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

    isFeatureEnabled(featureName: string): boolean {
        return !!this.features[featureName]; // Safely check if feature is enabled
    }
}

export default FeaturesService;
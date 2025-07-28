//src/privoders/fileService.provider.ts
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { inject } from 'tsyringe';
import winston from 'winston';
import { IFileService } from '../interface/feature.interface';
import FeaturesModel from '../model/feature.model';
import { WINSTON_LOGGER } from '../utils/logger';
import { ILogger } from '../interface/logger.interface';


class FileService implements IFileService {
    public filePath: string;
    public model: FeaturesModel; // Using concrete class here, could be interface if more flexible
    private readonly logger: ILogger;


    constructor(
        filePath: string,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.filePath = filePath;
        this.model = new FeaturesModel();
        this.logger = logger;
    }

    async initialize(): Promise<void> {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf8');
            const config = yaml.load(fileContent) as Record<string, boolean>; // Type assertion
            if (config && typeof config === 'object') {
                for (const key in config) {
                    if (Object.prototype.hasOwnProperty.call(config, key)) {
                        this.model.add(key, config[key]);
                    }
                }
            }
        } catch (error) {
            this.logger.error('Error initializing FileService:', error);
            throw error; // Re-throw to be caught by service/controller
        }
    }

    async save(): Promise<void> {
        try {
            const yamlStr = yaml.dump(this.model.read());
            await fs.writeFile(this.filePath, yamlStr, 'utf8');
        } catch (error) {
            this.logger.error('Error saving FileService:', error);
            throw error; // Re-throw to be caught by service/controller
        }
    }
}

export default FileService;
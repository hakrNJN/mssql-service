import { IFileService } from '../interface/feature.interface';
import FeaturesModel from '../model/feature.model';
import { ILogger } from '../interface/logger.interface';
declare class FileService implements IFileService {
    filePath: string;
    model: FeaturesModel;
    private readonly logger;
    constructor(filePath: string, logger: ILogger);
    initialize(): Promise<void>;
    save(): Promise<void>;
}
export default FileService;

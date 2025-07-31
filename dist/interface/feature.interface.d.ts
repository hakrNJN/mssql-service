export interface FeatureConfig {
    [key: string]: boolean | {
        [key: string]: string;
    } | undefined;
    queueNames?: {
        [key: string]: string;
    };
    enableRabbitMQ?: boolean;
}
export interface IFeaturesModel {
    read(): FeatureConfig;
    add(key: string, value: boolean): void;
    edit(key: string, value: boolean): void;
    delete(key: string): void;
}
export interface IFeaturesService {
    loadFeatures(): Promise<void>;
    getFeatures(): FeatureConfig;
    fileService: IFileService;
}
export interface IFeatureController {
    handleRequest(req: any, res: any, next: any): Promise<void>;
}
export interface IFileService {
    filePath: string;
    model: IFeaturesModel;
    initialize(): Promise<void>;
    save(): Promise<void>;
}

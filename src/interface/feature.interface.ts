//src/interface/feature.interface.ts
export interface FeatureConfig {
    [key: string]: boolean; // Assuming feature flags are boolean for now
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
    fileService: IFileService; // Assuming FileService interface
  }
  
  export interface IFeatureController {
    handleRequest(req: any, res: any, next: any): Promise<void>; // Express Request, Response, NextFunction types would be better in real app
  }
  
  export interface IFileService {
    filePath: string;
    model: IFeaturesModel;
    initialize(): Promise<void>;
    save(): Promise<void>;
  }
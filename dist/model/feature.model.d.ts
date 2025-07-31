import { FeatureConfig, IFeaturesModel } from "../interface/feature.interface";
declare class FeaturesModel implements IFeaturesModel {
    private features;
    constructor();
    read(): FeatureConfig;
    add(key: string, value: boolean): void;
    edit(key: string, value: boolean): void;
    delete(key: string): void;
}
export default FeaturesModel;

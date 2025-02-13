import { FeatureConfig, IFeaturesModel } from "../interface/feature.interface";


class FeaturesModel implements IFeaturesModel {
  private features: FeatureConfig = {};

  constructor() {
    this.features = {};
  }

  read(): FeatureConfig {
    return this.features;
  }

  add(key: string, value: boolean): void {
    if (!key || value === undefined) {
      throw new Error('Key or value is missing');
    }
    this.features[key] = value;
  }

  edit(key: string, value: boolean): void {
    if (!key || value === undefined) {
      throw new Error('Key or value is missing');
    }
    if (!this.features[key]) {
      throw new Error('Key not found');
    }
    this.features[key] = value;
  }

  delete(key: string): void {
    if (!key) {
      throw new Error('Key is missing');
    }
    if (!this.features[key]) {
      throw new Error('Key not found');
    }
    delete this.features[key];
  }
}

export default FeaturesModel;
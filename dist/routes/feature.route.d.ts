import { Router } from 'express';
import FeaturesService from '../services/feature.service';
declare const featureRoute: (featuresService: FeaturesService) => Router;
export default featureRoute;

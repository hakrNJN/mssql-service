//src/routes/feature.route.ts
import { Router } from 'express';
import FeatureController from '../controllers/feature.controller';
import FeaturesService from '../services/feature.service';



const featureRoute = (featuresService: FeaturesService): Router => { // Accept FeaturesService as argument
    const router: Router = Router();
    const featureController = new FeatureController(featuresService);
  
    router.all('/features', featureController.handleRequest);
  
    return router;
  };

export default featureRoute;
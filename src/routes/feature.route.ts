//src/routes/feature.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import FeatureController from '../controllers/feature.controller';



const featureRoute = (): Router => { // Accept FeaturesService as argument
  const router: Router = Router();

  // const featureController = new FeatureController(featuresService);
  const featureController = container.resolve(FeatureController);

  router.all('/features', featureController.handleRequest);

  return router;
};

export default featureRoute;
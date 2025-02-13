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
// const featureRoute = (): Router => { // Accept dataSource as argument
//   const router: Router = Router();

//   const featuresService = new FeaturesService(path.join(__dirname, '../config')); // Path to your config folder
//   const featureController = new FeatureController(featuresService);

//   router.all('/features', featureController.handleRequest);

//   featuresService.loadFeatures().then(() => {
//     const features = featuresService.getFeatures();
//     if (features.fetchDataEnabled) {
//       console.log("Fetch Data Feature is enabled!");
//       // ... your feature logic here ...
//     } else {
//       console.log("Fetch Data Feature is disabled.");
//     }
//   });

//   return router; // Return the router
// };

export default featureRoute;
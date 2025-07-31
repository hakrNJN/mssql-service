import { Router } from 'express';
import { DataSourceService } from '../services/dataSource.service';
import FeaturesService from '../services/feature.service';
declare const apiRoutes: (dataSourceService: DataSourceService, featuresService: FeaturesService) => Router;
export default apiRoutes;

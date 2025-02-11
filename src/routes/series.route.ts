//src/routes/year.route.ts
import { Router } from 'express';
import { SeriesController } from '../controllers/series.controller';
import { AppDataSource } from '../providers/data-source.provider';
import { SeriesService } from '../services/series.service';

// Adjust path if needed

const seriesRoute = (dataSource: AppDataSource): Router => { // Accept dataSource as argument
  const router: Router = Router();

  // Initialize YearService with dataSource
  const seriesService = new SeriesService(dataSource);
  seriesService.initialize(); // Initialize YearService (repository)

  // Create YearController instance with the initialized YearService
  const seriesController = new SeriesController(seriesService);

  // Define routes here, calling controller methods
  router.get('/', seriesController.getAllSeries);
  router.get('/getirnseries', seriesController.getIrnSeries);
  router.get('/:id', seriesController.getSeriesById);

  return router; // Return the router
};

export default seriesRoute;
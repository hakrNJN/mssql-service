//src/routes/year.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { SeriesController } from '../controllers/series.controller';

// Adjust path if needed

const seriesRoute = (): Router => { // Accept dataSource as argument
  const router: Router = Router();

  // Initialize YearService with dataSource
  // const seriesService = new SeriesService(dataSource);
  // seriesService.initialize(); // Initialize YearService (repository)

  // // Create YearController instance with the initialized YearService
  // const seriesController = new SeriesController(seriesService);

  const seriesController = container.resolve(SeriesController);

  // Define routes here, calling controller methods
  router.get('/all', seriesController.getAllSeries);
  router.get('/getirnseries', seriesController.getIrnSeries);
  router.get('/:id', seriesController.getSeriesById);

  return router; // Return the router
};

export default seriesRoute;
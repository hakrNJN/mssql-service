import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
// Adjust path if needed

class TestRoutes {
  public router: Router;
  private testController: TestController; // Instantiate the controller

  constructor() {
    this.router = Router();
    this.testController = new TestController(); // Create an instance of the controller
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Define your routes here, calling controller methods

    // GET /api/test/
    this.router.get('/', this.testController.getAllTests);

    // // GET /api/test/:id
    // this.router.get('/:id', this.testController.getTestById);

    // // POST /api/test/
    // this.router.post('/', this.testController.createTest);

    // // PUT /api/test/:id
    // this.router.put('/:id', this.testController.updateTest);

    // // DELETE /api/test/:id
    // this.router.delete('/:id', this.testController.deleteTest);
  }
}

export default new TestRoutes().router; // Export the router instance
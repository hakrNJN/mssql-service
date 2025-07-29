// // src/tests/test.controller.test.ts
// import { Request, Response } from 'express';
// import { TestController } from '../controllers/test.controller';
// import { ApiResponse } from '../../utils/api-response';

// // Mock ApiResponse
// jest.mock('../utils/api-response', () => ({
//   ApiResponse: {
//     success: jest.fn(),
//   },
// }));

// describe('TestController', () => {
//   let controller: TestController;
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;

//   beforeEach(() => {
//     controller = new TestController();
//     mockRequest = {
//       query: {},
//     };
//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('getAllTests', () => {
//     it('should return paginated tests', async () => {
//       mockRequest.query = { page: '1', limit: '5' };

//       await controller.getAllTests(mockRequest as Request, mockResponse as Response);

//       expect(ApiResponse.success).toHaveBeenCalledWith(expect.objectContaining({
//         data: expect.any(Array),
//         metadata: expect.objectContaining({
//           page: 1,
//           perPage: 5,
//         }),
//       }));
//     });
//   });
// });
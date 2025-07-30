// src/tests/controllers/test.controller.test.ts
import { Request, Response } from 'express';
import { TestController } from '../../controllers/test.controller';
import { ApiResponse } from '../../utils/api-response';
import { HttpException } from '../../exceptions/httpException';

// Mock ApiResponse
jest.mock('../../utils/api-response');

describe('TestController', () => {
  let controller: TestController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new TestController();
    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTests', () => {
    it('should return paginated tests', async () => {
      mockRequest.query = { page: '2', limit: '5' };

      await controller.getAllTests(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: [
          { id: 6, name: 'Test 6' },
          { id: 7, name: 'Test 7' },
          { id: 8, name: 'Test 8' },
          { id: 9, name: 'Test 9' },
          { id: 10, name: 'Test 10' },
        ],
        message: 'Tests retrieved (page 2)',
        metadata: {
          totalCount: 15,
          page: 2,
          perPage: 5,
          totalPages: 3,
        },
      });
    });

    it('should handle default pagination', async () => {
      await controller.getAllTests(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        message: 'Tests retrieved (page 1)',
        metadata: expect.objectContaining({ page: 1, perPage: 10 }),
      }));
    });

    it('should throw NotFound if no tests are found', async () => {
      mockRequest.query = { page: '100', limit: '10' }; // Page with no results

      await expect(controller.getAllTests(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Tests not found')
      );
    });
  });
});
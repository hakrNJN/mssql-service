// src/tests/year.controller.test.ts
import { Request, Response } from 'express';
import { YearController } from '../../controllers/year.controller';
import { HttpException } from '../../exceptions/httpException';
import { YearService } from '../../services/years.service';
import { ApiResponse } from '../../utils/api-response';

// Mock YearService
jest.mock('../../services/years.service');

// Mock ApiResponse
jest.mock('../../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('YearController', () => {
  let controller: YearController;
  let mockService: jest.Mocked<YearService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new YearService(null as any) as jest.Mocked<YearService>;
    controller = new YearController(mockService);
    mockRequest = {
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getYears', () => {
    it('should return all years', async () => {
      const mockData = [{ id: 1 }];
      mockService.getYears = jest.fn().mockResolvedValue(mockData);

      await controller.getYears(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getYearById', () => {
    it('should return a year by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getYearsById = jest.fn().mockResolvedValue(mockData);

      await controller.getYearById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });

    it('should throw NotFound if year not found', async () => {
      mockRequest.params = { id: '1' };
      mockService.getYearsById = jest.fn().mockResolvedValue(null);

      await expect(controller.getYearById(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.NotFound('Years not found'));
    });
  });
});
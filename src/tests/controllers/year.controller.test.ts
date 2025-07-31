// src/tests/controllers/year.controller.test.ts
import { Request, Response } from 'express';
import { YearController } from '../../controllers/year.controller';
import { HttpException } from '../../exceptions/httpException';
import { YearService } from '../../services/years.service';
import { ApiResponse } from '../../utils/api-response';

// Mock YearService and ApiResponse
jest.mock('../../services/years.service');
jest.mock('../../utils/api-response');

describe('YearController', () => {
  let controller: YearController;
  let mockService: jest.Mocked<YearService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new YearService(null as any) as jest.Mocked<YearService>;
    mockService.initialize = jest.fn().mockResolvedValue(undefined);
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getYears', () => {
    it('should return all years', async () => {
      const mockData = [{ id: 1 }];
      mockService.getYears.mockResolvedValue(mockData as any);

      await controller.getYears(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'All Avalable Years Retrived',
      });
    });

    it('should throw NotFound if no years are found', async () => {
      mockService.getYears.mockResolvedValue(null);

      await expect(controller.getYears(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Years not found')
      );
    });
  });

  describe('getYearById', () => {
    it('should return a year by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getYearsById.mockResolvedValue(mockData as any);

      await controller.getYearById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Year retrived for id 1',
      });
    });

    it('should throw NotFound if year not found', async () => {
      mockRequest.params = { id: '1' };
      mockService.getYearsById.mockResolvedValue(null);

      await expect(controller.getYearById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Years not found')
      );
    });
  });
});
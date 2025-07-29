// src/tests/series.controller.test.ts
import { Request, Response } from 'express';
import { SeriesController } from '../../controllers/series.controller';
import { HttpException } from '../../exceptions/httpException';
import { SeriesService } from '../../services/series.service';
import { ApiResponse } from '../../utils/api-response';

// Mock SeriesService
jest.mock('../../services/series.service');

// Mock ApiResponse
jest.mock('../../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('SeriesController', () => {
  let controller: SeriesController;
  let mockService: jest.Mocked<SeriesService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new SeriesService(null as any) as jest.Mocked<SeriesService>;
    controller = new SeriesController(mockService);
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

  describe('getAllSeries', () => {
    it('should return all series', async () => {
      const mockData = [{ id: 1 }];
      mockService.getAllSeries = jest.fn().mockResolvedValue(mockData);

      await controller.getAllSeries(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getSeriesById', () => {
    it('should return a series by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getSeriesbyId = jest.fn().mockResolvedValue(mockData);

      await controller.getSeriesById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getIrnSeries', () => {
    it('should return IRN series', async () => {
      mockRequest.query = { yearid: '2023', type: 'D', company: '1' };
      const mockData = [{ id: 1 }];
      mockService.getSeriesWithFilters = jest.fn().mockResolvedValue(mockData);

      await controller.getIrnSeries(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });

    it('should throw BadRequest if company is missing', async () => {
      mockRequest.query = { yearid: '2023', type: 'D' };

      await expect(controller.getIrnSeries(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.BadRequest('Company is required'));
    });
  });
});
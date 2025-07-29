// src/tests/KotakCMS.controller.test.ts
import { Request, Response } from 'express';
import { KotakCMSController } from '../../controllers/KotakCMS.controller';
import { HttpException } from '../../exceptions/httpException';
import { KotakCMSService } from '../../services/KotakCMS.Service';
import { ApiResponse } from '../../utils/api-response';

// Mock KotakCMSService
jest.mock('../../services/KotakCMS.Service');

// Mock ApiResponse
jest.mock('../../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('KotakCMSController', () => {
  let controller: KotakCMSController;
  let mockService: jest.Mocked<KotakCMSService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new KotakCMSService(null as any) as jest.Mocked<KotakCMSService>;
    controller = new KotakCMSController(mockService);
    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllKotakCMS', () => {
    it('should return data on success', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023', page: '1', limit: '10' };
      const mockData = [{ id: 1 }];
      mockService.getKotakCMSData = jest.fn().mockResolvedValue(mockData);

      await controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response);

      expect(mockService.getKotakCMSData).toHaveBeenCalledWith(1, 10, 'C1', 2023, 0, 10);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Kotak CMS records retrieved successfully',
      });
    });

    it('should throw BadRequest if required params are missing', async () => {
      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.BadRequest('Missing required query parameters: fromVno, toVno, conum, yearid.'));
    });

    it('should throw NotFound if no data is found', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023' };
      mockService.getKotakCMSData = jest.fn().mockResolvedValue([]);

      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.NotFound('No Kotak CMS records found matching criteria.'));
    });

    it('should throw InternalServerError on service error', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023' };
      const error = new Error('Service error');
      mockService.getKotakCMSData = jest.fn().mockRejectedValue(error);

      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.InternalServerError('Something Went Wrong while fetching Kotak CMS records', error));
    });
  });
});
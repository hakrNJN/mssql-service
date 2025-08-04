import { Request, Response } from 'express';
import { SaleTransactionController } from '../../controllers/saleTransaction.controller';
import { HttpException } from '../../exceptions/httpException';
import { SaleTransactionService } from '../../services/saleTransaction.service';
import { ApiResponse } from '../../utils/api-response';
import { ILogger } from '../../interface/logger.interface';

// Mock SaleTransactionService and ApiResponse
jest.mock('../../services/saleTransaction.service');
jest.mock('../../utils/api-response');

describe('SaleTransactionController', () => {
  let controller: SaleTransactionController;
  let mockService: jest.Mocked<SaleTransactionService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockService = new SaleTransactionService(null as any, null as any) as jest.Mocked<SaleTransactionService>; // Updated to match new constructor
    mockService.getTransactionById = jest.fn();

    controller = new SaleTransactionController(mockService, mockLogger);
    mockRequest = {
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

  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getTransactionById.mockResolvedValue(mockData as any);

      await controller.getTransactionById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Transaction retrived for id 1',
      });
    });

    it('should throw NotFound if transaction not found', async () => {
      mockRequest.params = { id: '1' };
      mockService.getTransactionById.mockResolvedValue(null);

      await expect(controller.getTransactionById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Transactions not found')
      );
    });

    it('should throw InternalServerError on service error', async () => {
      mockRequest.params = { id: '1' };
      const error = new Error('Service error');
      mockService.getTransactionById.mockRejectedValue(error);

      await expect(controller.getTransactionById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.InternalServerError('Something Went Wrong')
      );
    });
  });
});
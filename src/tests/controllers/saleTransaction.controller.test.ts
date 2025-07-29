// src/tests/saleTransaction.controller.test.ts
import { Request, Response } from 'express';
import { SaleTransactionController } from '../../controllers/saleTransaction.controller';
import { HttpException } from '../../exceptions/httpException';
import { SaleTransactionService } from '../../services/saleTransaction.service';
import { ApiResponse } from '../../utils/api-response';

// Mock SaleTransactionService
jest.mock('../../services/saleTransaction.service');

// Mock ApiResponse
jest.mock('../../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('SaleTransactionController', () => {
  let controller: SaleTransactionController;
  let mockService: jest.Mocked<SaleTransactionService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new SaleTransactionService(null as any) as jest.Mocked<SaleTransactionService>;
    controller = new SaleTransactionController(mockService);
    mockRequest = {
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

  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getTransactionById = jest.fn().mockResolvedValue(mockData);

      await controller.getTransactionById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });

    it('should throw NotFound if transaction not found', async () => {
      mockRequest.params = { id: '1' };
      mockService.getTransactionById = jest.fn().mockResolvedValue(null);

      await expect(controller.getTransactionById(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(HttpException.NotFound('Transactions not found'));
    });
  });
});
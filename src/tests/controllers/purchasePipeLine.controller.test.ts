// src/tests/purchasePipeLine.controller.test.ts
import { Request, Response } from 'express';
import { PurchasePipeLineController } from '../../controllers/purchasePipeLine.controller';
import { PurchaseParcelStatusService } from '../../services/PurchaseInwardOutWard.service';
import { ApiResponse } from '../../utils/api-response';

// Mock PurchaseParcelStatusService
jest.mock('../../services/PurchaseInwardOutWard.service');

// Mock ApiResponse
jest.mock('../../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('PurchasePipeLineController', () => {
  let controller: PurchasePipeLineController;
  let mockService: jest.Mocked<PurchaseParcelStatusService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new PurchaseParcelStatusService(null as any, null as any) as jest.Mocked<PurchaseParcelStatusService>;
    controller = new PurchasePipeLineController(mockService);
    mockRequest = {
      query: {},
      params: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEntriesByFilter', () => {
    it('should return data on success', async () => {
      mockRequest.query = { company: 'C1', startDate: '2023-01-01', endDate: '2023-12-31', customer: 'Cust1' };
      const mockData = [{ id: 1 }];
      mockService.getEntriesByFilter = jest.fn().mockResolvedValue(mockData);

      await controller.getEntriesByFilter(mockRequest as Request, mockResponse as Response);

      expect(mockService.getEntriesByFilter).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entries retrieved successfully',
      });
    });
  });

  describe('getEntryById', () => {
    it('should return data on success', async () => {
      mockRequest.params = { purTrnId: '1' };
      mockRequest.query = { company: 'C1', startDate: '2023-01-01', endDate: '2023-12-31', customer: 'Cust1' };
      const mockData = { id: 1 };
      mockService.GetEntrybyId = jest.fn().mockResolvedValue(mockData);

      await controller.getEntryById(mockRequest as Request, mockResponse as Response);

      expect(mockService.GetEntrybyId).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entry retrieved for PurTrnId: 1',
      });
    });
  });

  describe('insertEntry', () => {
    it('should return created data on success', async () => {
      mockRequest.body = { Purtrnid: 1, Type: 1, Vno: 1, Dat: new Date() };
      const mockData = { id: 1 };
      mockService.InsetEntry = jest.fn().mockResolvedValue(mockData);

      await controller.insertEntry(mockRequest as Request, mockResponse as Response);

      expect(mockService.InsetEntry).toHaveBeenCalledWith(mockRequest.body);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entry created successfully',
        statusCode: 201,
      });
    });
  });

  describe('updateEntry', () => {
    it('should return success on update', async () => {
      mockRequest.params = { purTrnId: '1' };
      mockRequest.body = { Vno: 2 };
      mockService.UpdateEntry = jest.fn().mockResolvedValue(true);

      await controller.updateEntry(mockRequest as Request, mockResponse as Response);

      expect(mockService.UpdateEntry).toHaveBeenCalledWith(1, mockRequest.body);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: { updated: true },
        message: 'Purchase pipeline entry updated for PurTrnId: 1',
      });
    });
  });
});
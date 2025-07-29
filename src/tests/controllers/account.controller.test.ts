// src/tests/account.controller.test.ts
import { Request, Response } from 'express';
import { AccountController } from '../../controllers/account.controller';
import { AccountService } from '../../services/account.service';
import { ApiResponse } from '../../utils/api-response';

// Mock AccountService
jest.mock('../services/account.service');

// Mock ApiResponse
jest.mock('../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('AccountController', () => {
  let controller: AccountController;
  let mockService: jest.Mocked<AccountService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new AccountService(null as any) as jest.Mocked<AccountService>;
    controller = new AccountController(mockService);
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

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      const mockData = [{ id: 1 }];
      mockService.getAccounts = jest.fn().mockResolvedValue(mockData);

      await controller.getAllAccounts(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const mockData = [{ id: 1 }];
      mockService.getCustomers = jest.fn().mockResolvedValue(mockData);

      await controller.getAllCustomers(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getAllAgents', () => {
    it('should return all agents', async () => {
      const mockData = [{ id: 1 }];
      mockService.getAgents = jest.fn().mockResolvedValue(mockData);

      await controller.getAllAgents(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getAllTransporters', () => {
    it('should return all transporters', async () => {
      const mockData = [{ id: 1 }];
      mockService.getTransporters = jest.fn().mockResolvedValue(mockData);

      await controller.getAllTransporters(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getAccountById', () => {
    it('should return an account by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getAccountById = jest.fn().mockResolvedValue(mockData);

      await controller.getAccountById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getCustomerByGST', () => {
    it('should return a customer by GST', async () => {
      mockRequest.params = { gst: '123' };
      const mockData = { id: 1 };
      mockService.getCustomerByGST = jest.fn().mockResolvedValue(mockData);

      await controller.getCustomerByGST(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getAgentWithCustomers', () => {
    it('should return an agent with customers', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getAgentByIdWithCustomers = jest.fn().mockResolvedValue(mockData);

      await controller.getAgentWithCustomers(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });
});
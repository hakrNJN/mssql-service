// src/tests/company.controller.test.ts
import { Request, Response } from 'express';
import { CompanyController } from '../../controllers/company.controller';
import { CompanyService } from '../../services/company.service';
import { ApiResponse } from '../../utils/api-response';

// Mock CompanyService
jest.mock('../services/company.service');

// Mock ApiResponse
jest.mock('../utils/api-response', () => ({
  ApiResponse: {
    success: jest.fn(),
  },
}));

describe('CompanyController', () => {
  let controller: CompanyController;
  let mockService: jest.Mocked<CompanyService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new CompanyService(null as any) as jest.Mocked<CompanyService>;
    controller = new CompanyController(mockService);
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

  describe('getCompanies', () => {
    it('should return all companies', async () => {
      const mockData = [{ id: 1 }];
      mockService.getCompanies = jest.fn().mockResolvedValue(mockData);

      await controller.getCompanies(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getCompanyById = jest.fn().mockResolvedValue(mockData);

      await controller.getCompanyById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });

  describe('getCompanyByGSTIN', () => {
    it('should return a company by GSTIN', async () => {
      mockRequest.params = { gstin: '123' };
      const mockData = [{ id: 1 }];
      mockService.getCompaniesWithFilters = jest.fn().mockResolvedValue(mockData);

      await controller.getCompanyByGSTIN(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalled();
    });
  });
});
// src/tests/controllers/company.controller.test.ts
import { Request, Response } from 'express';
import { CompanyController } from '../../controllers/company.controller';
import { CompanyService } from '../../services/company.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpException } from '../../exceptions/httpException';
import { CompMst } from '../../entity/anushreeDb/company.entity';

// Mock CompanyService and ApiResponse
jest.mock('../../services/company.service');
jest.mock('../../utils/api-response');

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCompanies', () => {
    it('should return all companies', async () => {
      const mockData: CompMst[] = [
        {
          id: 1,
          Name: 'Test Company',
          Type: '',
          Owner: '',
          Short: '',
          CompGrp: '',
          Add1: '',
          Add2: '',
          Add3: '',
          City: '',
          Phone: '',
          Mobile: '',
          Fax: '',
          Email: '',
          WebSite: '',
          PanNo: '',
          TanNo: '',
          TinNo: '',
          CST: '',
          GST: '',
          Acc_year: '',
          AF_Date: new Date(),
          AT_Date: new Date(),
          Status: '',
          Bank: '',
          AcNo: '',
          Branch: '',
          IFSCCode: '',
          State: '',
          PinCode: '',
        },
      ];
      mockService.getCompanies.mockResolvedValue(mockData);

      await controller.getCompanies(mockRequest as Request, mockResponse as Response);

      expect(mockService.getCompanies).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'All Avalable Company Retrived',
      });
    });

    it('should throw NotFound if no companies are found', async () => {
      mockService.getCompanies.mockResolvedValue(null);

      await expect(controller.getCompanies(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Companies not found')
      );
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by id', async () => {
      const mockData: CompMst = {
        id: 1,
        Name: 'Test Company',
        Type: '',
        Owner: '',
        Short: '',
        CompGrp: '',
        Add1: '',
        Add2: '',
        Add3: '',
        City: '',
        Phone: '',
        Mobile: '',
        Fax: '',
        Email: '',
        WebSite: '',
        PanNo: '',
        TanNo: '',
        TinNo: '',
        CST: '',
        GST: '',
        Acc_year: '',
        AF_Date: new Date(),
        AT_Date: new Date(),
        Status: '',
        Bank: '',
        AcNo: '',
        Branch: '',
        IFSCCode: '',
        State: '',
        PinCode: '',
      };
      mockService.getCompanyById.mockResolvedValue(mockData);
      mockRequest.params = { id: '1' };

      await controller.getCompanyById(mockRequest as Request, mockResponse as Response);

      expect(mockService.getCompanyById).toHaveBeenCalledWith(1);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Company retrived for id 1',
      });
    });

    it('should throw NotFound if company not found', async () => {
      mockService.getCompanyById.mockResolvedValue(null);
      mockRequest.params = { id: '1' };

      await expect(controller.getCompanyById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Company not found')
      );
    });
  });

  describe('getCompanyByGSTIN', () => {
    it('should return a company by GSTIN', async () => {
      const mockData: CompMst[] = [
        {
          id: 1,
          Name: 'Test Company',
          Type: '',
          Owner: '',
          Short: '',
          CompGrp: '',
          Add1: '',
          Add2: '',
          Add3: '',
          City: '',
          Phone: '',
          Mobile: '',
          Fax: '',
          Email: '',
          WebSite: '',
          PanNo: '',
          TanNo: '',
          TinNo: '',
          CST: '',
          GST: '',
          Acc_year: '',
          AF_Date: new Date(),
          AT_Date: new Date(),
          Status: '',
          Bank: '',
          AcNo: '',
          Branch: '',
          IFSCCode: '',
          State: '',
          PinCode: '',
        },
      ];
      mockService.getCompaniesWithFilters.mockResolvedValue(mockData);
      mockRequest.params = { gstin: '12345' };

      await controller.getCompanyByGSTIN(mockRequest as Request, mockResponse as Response);

      expect(mockService.getCompaniesWithFilters).toHaveBeenCalledWith({ GST: { equal: '12345' } });
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Company retrived for GSTIN 12345',
      });
    });
  });
});
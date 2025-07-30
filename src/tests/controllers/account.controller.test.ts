
// src/tests/controllers/account.controller.test.ts
import { Request, Response } from 'express';
import { AccountController } from '../../controllers/account.controller';
import { AccountService } from '../../services/account.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpException } from '../../exceptions/httpException';
import { Mast } from '../../entity/anushree/accounts.entity';

// Mock AccountService and ApiResponse
jest.mock('../../services/account.service');
jest.mock('../../utils/api-response');

describe('AccountController', () => {
  let controller: AccountController;
  let mockService: jest.Mocked<AccountService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Mock the AccountService constructor and its methods
    mockService = new AccountService(null as any) as jest.Mocked<AccountService>;
    mockService.getAccounts = jest.fn();
    mockService.getCustomers = jest.fn();
    mockService.getAgents = jest.fn();
    mockService.getTransporters = jest.fn();
    mockService.getAccountById = jest.fn();
    mockService.getCustomerByGST = jest.fn();
    mockService.getAgentByIdWithCustomers = jest.fn();
    mockService.initialize = jest.fn().mockResolvedValue(undefined);

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should return all accounts with pagination', async () => {
      const mockData: Mast[] = [
        {
          id: 1,
          Name: 'Test Account',
          Add1: '',
          Add2: '',
          City: '',
          State: '',
          PinCode: 123456,
          Mobile: '',
          Email: '',
          ContPerson: '',
          PanNo: '',
          GST: '',
          Status: '',
          Bank: '',
          AcNo: '',
          IFSCCode: '',
          BlackList: '',
          Type: 1,
          SchdId: 1,
          Group: 1,
          AgentId: 1,
        },
      ];
      mockService.getAccounts.mockResolvedValue(mockData);
      mockRequest.query = { page: '1', limit: '10' };

      await controller.getAllAccounts(mockRequest as Request, mockResponse as Response);

      expect(mockService.getAccounts).toHaveBeenCalledWith(0, 10);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'All Avalable Accounts Retrived',
        metadata: { page: 1, perPage: 10 },
      });
    });

    it('should handle errors', async () => {
      mockService.getAccounts.mockRejectedValue(new Error('Test Error'));
      mockRequest.query = { page: '1', limit: '10' };

      await expect(controller.getAllAccounts(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.InternalServerError('Something Went Wrong', new Error('Test Error'))
      );
    });
  });

  // Similar tests for getAllCustomers, getAllAgents, getAllTransporters

  describe('getAccountById', () => {
    it('should return an account by id', async () => {
      const mockData: Mast = {
        id: 1,
        Name: 'Test Account',
        Add1: '',
        Add2: '',
        City: '',
        State: '',
        PinCode: 123456,
        Mobile: '',
        Email: '',
        ContPerson: '',
        PanNo: '',
        GST: '',
        Status: '',
        Bank: '',
        AcNo: '',
        IFSCCode: '',
        BlackList: '',
        Type: 1,
        SchdId: 1,
        Group: 1,
        AgentId: 1,
      };
      mockService.getAccountById.mockResolvedValue(mockData);
      mockRequest.params = { id: '1' };

      await controller.getAccountById(mockRequest as Request, mockResponse as Response);

      expect(mockService.getAccountById).toHaveBeenCalledWith(1);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Account retrived for id 1',
      });
    });

    it('should throw NotFound if account not found', async () => {
      mockService.getAccountById.mockResolvedValue(null);
      mockRequest.params = { id: '1' };

      await expect(controller.getAccountById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('Account not found')
      );
    });
  });

  describe('getCustomerByGST', () => {
    it('should return a customer by GST', async () => {
      const mockData: Mast[] = [
        {
          id: 1,
          Name: 'Test Customer',
          Add1: '',
          Add2: '',
          City: '',
          State: '',
          PinCode: 123456,
          Mobile: '',
          Email: '',
          ContPerson: '',
          PanNo: '',
          GST: '',
          Status: '',
          Bank: '',
          AcNo: '',
          IFSCCode: '',
          BlackList: '',
          Type: 1,
          SchdId: 1,
          Group: 1,
          AgentId: 1,
        },
      ];
      mockService.getCustomerByGST.mockResolvedValue(mockData);
      mockRequest.params = { gst: '12345' };

      await controller.getCustomerByGST(mockRequest as Request, mockResponse as Response);

      expect(mockService.getCustomerByGST).toHaveBeenCalledWith('12345');
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Account retrived for gst id 12345',
      });
    });
  });

  describe('getAgentWithCustomers', () => {
    it('should return an agent with customers', async () => {
      const mockData: { Agent: Mast | null } = {
        Agent: {
          id: 1,
          Name: 'Test Agent',
          Add1: '',
          Add2: '',
          City: '',
          State: '',
          PinCode: 123456,
          Mobile: '',
          Email: '',
          ContPerson: '',
          PanNo: '',
          GST: '',
          Status: '',
          Bank: '',
          AcNo: '',
          IFSCCode: '',
          BlackList: '',
          Type: 1,
          SchdId: 1,
          Group: 1,
          AgentId: 1,
        },
      };
      mockService.getAgentByIdWithCustomers.mockResolvedValue(mockData);
      mockRequest.params = { id: '1' };

      await controller.getAgentWithCustomers(mockRequest as Request, mockResponse as Response);

      expect(mockService.getAgentByIdWithCustomers).toHaveBeenCalledWith(1);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Account retrived for id 1',
      });
    });
  });
});

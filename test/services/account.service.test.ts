import "reflect-metadata";
import { AccountService } from '../../src/services/account.service';
import { AccountProvider } from '../../src/providers/account.provider';
import { DataSourceManager } from '../../src/services/dataSourceManager.service';
import { ILogger } from '../../src/interface/logger.interface';
import { Mast } from '../../src/entity/anushreeDb/accounts.entity';
import { DataSource } from 'typeorm';

// Mock ILogger
const mockLogger: ILogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock AccountProvider
const mockAccountProvider = {
  getAccountById: jest.fn(),
  getAllAccounts: jest.fn(),
  getAllAccountWithFilters: jest.fn(),
  getAgentByIdWithCustomers: jest.fn(),
} as any;

// Mock DataSourceManager
const mockDataSourceManager = {
  mainDataSource: {} as DataSource, // This will be a mocked DataSource
} as jest.Mocked<DataSourceManager>;

// Mock the AccountProvider constructor within AccountService
jest.mock('../../src/providers/account.provider', () => {
  return {
    AccountProvider: jest.fn().mockImplementation(() => {
      return mockAccountProvider;
    }),
  };
});

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AccountService(mockDataSourceManager, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountById', () => {
    it('should call accountProvider.getAccountById and return the result', async () => {
      const mockAccount = new Mast();
      mockAccountProvider.getAccountById.mockResolvedValue(mockAccount);

      const result = await service.getAccountById(1);

      expect(mockAccountProvider.getAccountById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getAccounts', () => {
    it('should call accountProvider.getAllAccounts and return the result', async () => {
      const mockAccounts: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccounts.mockResolvedValue(mockAccounts);

      const result = await service.getAccounts(0, 10);

      expect(mockAccountProvider.getAllAccounts).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getAccountsWithFilters', () => {
    it('should call accountProvider.getAllAccountWithFilters and return the result', async () => {
      const mockAccounts: Mast[] = [new Mast()];
      const filters = { Name: { equal: 'Test' } };
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockAccounts);

      const result = await service.getAccountsWithFilters(filters, 0, 10);

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(filters, 0, 10);
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getCustomers', () => {
    it('should call accountProvider.getAllAccountWithFilters with customer filters', async () => {
      const mockCustomers: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockCustomers);

      const result = await service.getCustomers(0, 10);

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 6 }, Status: { equal: 'T' } },
        0,
        10
      );
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('getCustomerById', () => {
    it('should call accountProvider.getAllAccountWithFilters with specific customer id filters', async () => {
      const mockCustomer: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockCustomer);

      const result = await service.getCustomerById(1);

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { id: { equal: 1 }, Type: { equal: 6 } },
        0,
        1
      );
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getCustomerByGST', () => {
    it('should call accountProvider.getAllAccountWithFilters with specific customer GST filters', async () => {
      const mockCustomer: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockCustomer);

      const result = await service.getCustomerByGST('GST123');

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { GST: { equal: 'GST123' }, Type: { equal: 6 } },
        0,
        100
      );
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getTransporters', () => {
    it('should call accountProvider.getAllAccountWithFilters with transporter filters', async () => {
      const mockTransporters: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockTransporters);

      const result = await service.getTransporters(0, 10);

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 25 }, Status: { equal: 'T' } },
        0,
        10
      );
      expect(result).toEqual(mockTransporters);
    });
  });

  describe('getAgents', () => {
    it('should call accountProvider.getAllAccountWithFilters with agent filters', async () => {
      const mockAgents: Mast[] = [new Mast()];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockAgents);

      const result = await service.getAgents(0, 10);

      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 2 }, Status: { equal: 'T' } },
        0,
        10
      );
      expect(result).toEqual(mockAgents);
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should call accountProvider.getAgentByIdWithCustomers and return the result', async () => {
      const mockAgentWithCustomers = { Agent: new Mast() };
      mockAccountProvider.getAgentByIdWithCustomers.mockResolvedValue(mockAgentWithCustomers);

      const result = await service.getAgentByIdWithCustomers(1);

      expect(mockAccountProvider.getAgentByIdWithCustomers).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAgentWithCustomers);
    });
  });
});
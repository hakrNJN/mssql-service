// src/tests/services/account.service.test.ts
import { AccountService } from '../../services/account.service';
import { AccountProvider } from '../../providers/account.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { ILogger } from '../../interface/logger.interface';
import { Mast } from '../../entity/anushreeDb/accounts.entity';
import { Filters, EqualFilter } from '../../types/filter.types';

// Mock the logger
const mockLogger: ILogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
};

// Mock AccountProvider
jest.mock('../../providers/account.provider');

describe('AccountService', () => {
  let service: AccountService;
  let mockAccountProvider: jest.Mocked<AccountProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource
    mockAccountProvider = new AccountProvider(mockDataSource) as jest.Mocked<AccountProvider>;
    mockAccountProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockAccountProvider.getAllAccounts = jest.fn();
    mockAccountProvider.getAccountById = jest.fn();
    mockAccountProvider.getAllAccountWithFilters = jest.fn();
    mockAccountProvider.getAgentByIdWithCustomers = jest.fn();


    service = new AccountService(mockDataSource);
    // Manually inject the mocked provider
    (service as any).accountProvider = mockAccountProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the account provider repository', async () => {
      await service.initialize();
      expect(mockAccountProvider.initializeRepository).toHaveBeenCalled();
    });
  });

  describe('getAccounts', () => {
    it('should call getAllAccounts on the provider', async () => {
      const mockAccounts: Mast[] = [{ id: 1, Name: 'Account 1' } as Mast];
      mockAccountProvider.getAllAccounts.mockResolvedValue(mockAccounts);
      const result = await service.getAccounts(0, 10);
      expect(result).toEqual(mockAccounts);
      expect(mockAccountProvider.getAllAccounts).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('getAccountById', () => {
    it('should call getAccountById on the provider', async () => {
      const mockAccount: Mast = { id: 1, Name: 'Account 1' } as Mast;
      mockAccountProvider.getAccountById.mockResolvedValue(mockAccount);
      const result = await service.getAccountById(1);
      expect(result).toEqual(mockAccount);
      expect(mockAccountProvider.getAccountById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAccountsWithFilters', () => {
    it('should call getAllAccountWithFilters on the provider', async () => {
      const mockAccounts: Mast[] = [{ id: 1, Name: 'Filtered Account' } as Mast];
      const filters: Filters<Mast> = { Name: { equal: 'Filtered Account' } as EqualFilter<string> };
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockAccounts);
      const result = await service.getAccountsWithFilters(filters, 0, 10);
      expect(result).toEqual(mockAccounts);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(filters, 0, 10);
    });
  });

  describe('getCustomers', () => {
    it('should call getAllAccountWithFilters on the provider with correct filters', async () => {
      const mockCustomers: Mast[] = [{ id: 1, Name: 'Customer 1', Type: 6, Status: 'T' } as Mast];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockCustomers);
      const result = await service.getCustomers(0, 10);
      expect(result).toEqual(mockCustomers);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 6 }, Status: { equal: 'T' } },
        0,
        10
      );
    });
  });

  describe('getCustomerById', () => {
    it('should call getAllAccountWithFilters on the provider with correct filters for customer by ID', async () => {
      const mockCustomer: Mast = { id: 1, Name: 'Customer 1', Type: 6 } as Mast;
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue([mockCustomer]);
      const result = await service.getCustomerById(1);
      expect(result).toEqual([mockCustomer]);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { id: { equal: 1 }, Type: { equal: 6 } },
        0,
        1
      );
    });
  });

  describe('getCustomerByGST', () => {
    it('should call getAllAccountWithFilters on the provider with correct filters for customer by GST', async () => {
      const mockCustomer: Mast = { id: 1, Name: 'Customer 1', GST: 'GST123', Type: 6 } as Mast;
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue([mockCustomer]);
      const result = await service.getCustomerByGST('GST123');
      expect(result).toEqual([mockCustomer]);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { GST: { equal: 'GST123' }, Type: { equal: 6 } },
        0,
        100
      );
    });
  });

  describe('getTransporters', () => {
    it('should call getAllAccountWithFilters on the provider with correct filters', async () => {
      const mockTransporters: Mast[] = [{ id: 1, Name: 'Transporter 1', Type: 25, Status: 'T' } as Mast];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockTransporters);
      const result = await service.getTransporters(0, 10);
      expect(result).toEqual(mockTransporters);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 25 }, Status: { equal: 'T' } },
        0,
        10
      );
    });
  });

  describe('getAgents', () => {
    it('should call getAllAccountWithFilters on the provider with correct filters', async () => {
      const mockAgents: Mast[] = [{ id: 1, Name: 'Agent 1', Type: 2, Status: 'T' } as Mast];
      mockAccountProvider.getAllAccountWithFilters.mockResolvedValue(mockAgents);
      const result = await service.getAgents(0, 10);
      expect(result).toEqual(mockAgents);
      expect(mockAccountProvider.getAllAccountWithFilters).toHaveBeenCalledWith(
        { Type: { equal: 2 }, Status: { equal: 'T' } },
        0,
        10
      );
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should call getAgentByIdWithCustomers on the provider', async () => {
      const mockAgentWithCustomers = { Agent: { id: 1, Name: 'Agent 1', Type: 2, customers: [] } as Mast };
      mockAccountProvider.getAgentByIdWithCustomers.mockResolvedValue(mockAgentWithCustomers);
      const result = await service.getAgentByIdWithCustomers(1);
      expect(result).toEqual(mockAgentWithCustomers);
      expect(mockAccountProvider.getAgentByIdWithCustomers).toHaveBeenCalledWith(1);
    });
  });
});

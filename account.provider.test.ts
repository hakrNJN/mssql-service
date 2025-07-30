// account.provider.test.ts
import { AccountProvider } from './src/providers/account.provider';
import { AppDataSource } from './src/providers/data-source.provider';
import { Mast } from './src/entity/anushree/accounts.entity';
import { applyFilters } from './src/utils/query-utils';
import { ILogger } from './src/interface/logger.interface';

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

// Mock query-utils
jest.mock('./src/utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  }),
};

// Mock AppDataSource
const mockDataSource = {
  init: jest.fn().mockResolvedValue({ getRepository: () => mockRepository }),
};

describe('AccountProvider', () => {
  let provider: AccountProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new AccountProvider(mockDataSourceInstance);
    // Manually inject logger
    (provider as any).logger = mockLogger;
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should get all accounts', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllAccounts();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllAccountWithFilters', () => {
    it('should get accounts with filters', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllAccountWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'account');
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should get an agent with customers', async () => {
      const mockData: Mast = { id: 1, Name: 'Test Agent' } as Mast;
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: mockData });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, Type: 2 },
        relations: ['customers'],
      });
    });
  });

  describe('getAccountById', () => {
    it('should get an account by id', async () => {
      const mockData: Mast = { id: 1, Name: 'Test Account' } as Mast;
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getAccountById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
// account.provider.test.ts
import { AccountProvider } from './src/providers/account.provider';
import { Mast } from './src/entity/anushreeDb/accounts.entity'; // Corrected path
import { applyFilters } from './src/utils/query-utils';
import { ILogger } from './src/interface/logger.interface';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'; // Import necessary TypeORM types

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

describe('AccountProvider', () => {
  let provider: AccountProvider;
  let mockAccountRepository: Partial<Repository<Mast>>;
  let mockDataSource: Partial<DataSource>;
  let mockQueryBuilder: Partial<SelectQueryBuilder<Mast>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryBuilder = {
      getMany: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    mockAccountRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockAccountRepository),
    };

    // Instantiate AccountProvider with mocked dependencies
    provider = new AccountProvider(
      mockDataSource as DataSource,
      mockLogger
    );

    // Mock the trimWhitespace method added by the decorator
    jest.spyOn(provider, 'trimWhitespace').mockImplementation((data) => data);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should get all accounts', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      mockAccountRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllAccounts();

      expect(result).toEqual(mockData);
      expect(mockAccountRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });

    it('should get all accounts with offset and limit', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      mockAccountRepository.find.mockResolvedValue(mockData);

      const offset = 0;
      const limit = 10;
      const result = await provider.getAllAccounts(offset, limit);

      expect(result).toEqual(mockData);
      expect(mockAccountRepository.find).toHaveBeenCalledWith({ skip: offset, take: limit, order: { id: 'ASC' } });
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getAllAccountWithFilters', () => {
    it('should get accounts with filters', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      (mockQueryBuilder.getMany as jest.Mock).mockResolvedValue(mockData);
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder); // applyFilters returns the modified queryBuilder

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllAccountWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(mockAccountRepository.createQueryBuilder).toHaveBeenCalledWith('account');
      expect(applyFilters).toHaveBeenCalledWith(mockQueryBuilder, filters, 'account');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('account.id', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });

    it('should get accounts with filters, offset, and limit', async () => {
      const mockData: Mast[] = [{ id: 1, Name: 'Test Account' } as Mast];
      (mockQueryBuilder.getMany as jest.Mock).mockResolvedValue(mockData);
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder);

      const filters = { Name: { equal: 'Test' } };
      const offset = 0;
      const limit = 10;
      const result = await provider.getAllAccountWithFilters(filters, offset, limit);

      expect(result).toEqual(mockData);
      expect(mockAccountRepository.createQueryBuilder).toHaveBeenCalledWith('account');
      expect(applyFilters).toHaveBeenCalledWith(mockQueryBuilder, filters, 'account');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(offset);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('account.id', 'ASC');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should get an agent with customers', async () => {
      const mockData: Mast = { id: 1, Name: 'Test Agent', Type: 2 } as Mast;
      mockAccountRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: mockData });
      expect(mockAccountRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, Type: 2 },
        relations: ['customers'],
      });
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });

    it('should return null if agent not found', async () => {
      mockAccountRepository.findOne.mockResolvedValue(null);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: null });
      expect(mockAccountRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, Type: 2 },
        relations: ['customers'],
      });
      expect(provider.trimWhitespace).not.toHaveBeenCalled(); // trimWhitespace should not be called if agent is null
    });
  });

  describe('getAccountById', () => {
    it('should get an account by id', async () => {
      const mockData: Mast = { id: 1, Name: 'Test Account' } as Mast;
      mockAccountRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getAccountById(1);

      expect(result).toEqual(mockData);
      expect(mockAccountRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});

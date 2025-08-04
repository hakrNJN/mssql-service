// src/tests/account.provider.test.ts
import { container } from 'tsyringe';
import { Mast } from '../../entity/anushreeDb/accounts.entity';
import winston from 'winston';
import { AccountProvider } from '../../providers/account.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { WINSTON_LOGGER } from '../../utils/logger';
import { applyFilters } from '../../utils/query-utils';

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock query-utils
jest.mock('../../utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
};

describe('AccountProvider', () => {
  let provider: AccountProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = new AppDataSource(mockLogger) as jest.Mocked<AppDataSource>;
    (mockDataSource.init as jest.Mock).mockResolvedValue({
      getRepository: mockGetRepository,
    });

    provider = new AccountProvider(mockDataSource);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should get all accounts', async () => {
      const mockData = [new Mast(), new Mast()];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllAccounts(0, 10);

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10, order: { id: 'ASC' } });
    });
  });

  describe('getAllAccountWithFilters', () => {
    it('should get accounts with filters', async () => {
      const mockData = [new Mast(), new Mast()];
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllAccountWithFilters(filters, 0, 10);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'account');
    });
  });

  describe('getAccountById', () => {
    it('should get an account by id', async () => {
      const mockData = new Mast();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getAccountById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAgentByIdWithCustomers', () => {
    it('should get an agent with customers', async () => {
      const mockData = new Mast();
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: mockData });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, Type: 2 },
        relations: ['customers'],
      });
    });

    it('should return null if agent not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await provider.getAgentByIdWithCustomers(1);

      expect(result).toEqual({ Agent: null });
    });
  });
});

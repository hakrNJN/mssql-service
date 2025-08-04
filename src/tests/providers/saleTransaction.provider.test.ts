// src/tests/providers/saleTransaction.provider.test.ts
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';
import { SaleTransaction } from '../../entity/phoenixDb/saleTransaction.entity';
import { ILogger } from '../../interface/logger.interface';
import { DataSource, Repository } from 'typeorm';

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock TypeORM repository
const mockRepository: jest.Mocked<Repository<SaleTransaction>> = {
  findOne: jest.fn(),
} as jest.Mocked<Repository<SaleTransaction>>;

describe('SaleTransactionProvider', () => {
  let provider: SaleTransactionProvider;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    } as unknown as jest.Mocked<DataSource>;

    provider = new SaleTransactionProvider(mockDataSource, mockLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getTransactionById', () => {
    it('should get a transaction by id', async () => {
      const mockData = new SaleTransaction();
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getTransactionById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { SalTrnId: 1 },
        relations: ['products'],
      });
    });

    it('should return null on error', async () => {
      const error = new Error('DB Error');
      mockRepository.findOne.mockRejectedValue(error);

      const result = await provider.getTransactionById(1);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith('Error fetching sale transaction:', error);
    });
  });
});
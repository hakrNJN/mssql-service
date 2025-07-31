// src/tests/providers/saleTransaction.provider.test.ts
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import { SaleTransaction } from '../../entity/phoenixDb/saleTransaction.entity';
import { Repository } from 'typeorm';
import { ILogger } from '../../interface/logger.interface';

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

// Mock PhoenixDataSource
const mockRepository = {
  findOne: jest.fn(),
};
const mockDataSource = {
  init: jest.fn().mockResolvedValue({
    getRepository: jest.fn().mockReturnValue(mockRepository),
  }),
};

describe('SaleTransactionProvider', () => {
  let provider: SaleTransactionProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as PhoenixDataSource;
    provider = new SaleTransactionProvider(mockDataSourceInstance);
    // Manually inject logger
    (provider as any).logger = mockLogger;
    await provider.initializeRepository();
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
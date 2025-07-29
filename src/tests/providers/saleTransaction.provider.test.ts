// src/tests/saleTransaction.provider.test.ts
import { container } from 'tsyringe';
import { SaleTransaction } from '../../entity/phoenix/SaleTransaction';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';

// Mock the logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });

// Mock PhoenixDataSource
jest.mock('../../providers/phoenix.data-source.provider', () => {
  const mockRepository = {
    findOne: jest.fn(),
  };
  return {
    PhoenixDataSource: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue({
        getRepository: jest.fn(() => mockRepository),
      }),
      getRepository: jest.fn(() => mockRepository),
    })),
  };
});





describe('SaleTransactionProvider', () => {
  let provider: SaleTransactionProvider;
  let mockDataSource: jest.Mocked<PhoenixDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDataSource = new PhoenixDataSource(mockLogger) as jest.Mocked<PhoenixDataSource>;
    (mockDataSource.init as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue(mockRepository),
    });

    provider = new SaleTransactionProvider(mockDataSource);
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
      mockRepository.findOne.mockRejectedValue(new Error('DB Error'));

      const result = await provider.getTransactionById(1);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
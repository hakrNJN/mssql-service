// src/tests/saleTransaction.provider.test.ts
import { container } from 'tsyringe';
import { SaleTransaction } from '../../entity/phoenix/SaleTransaction';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';
import { WINSTON_LOGGER } from '../../utils/logger';

// Mock the logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  exceptions: jest.fn(),
  rejections: jest.fn(),
  profile: jest.fn(),
  startTimer: jest.fn(),
  transports: [],
  exitOnError: jest.fn(),
  format: jest.fn(),
  levels: jest.fn(),
  level: 'debug',
  silent: jest.fn(),
  configure: jest.fn(),
  defaultMeta: {},
  child: jest.fn(),
  is  : jest.fn(),
};
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });

// Mock PhoenixDataSource
jest.mock('../../providers/phoenix.data-source.provider', () => {
  const mockGetRepository = jest.fn();
  return {
    PhoenixDataSource: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue({
        getRepository: mockGetRepository,
      }),
      getRepository: mockGetRepository,
    })),
  };
});

// Mock TypeORM repository
const mockRepository = {
  findOne: jest.fn(),
};

describe('SaleTransactionProvider', () => {
  let provider: SaleTransactionProvider;
  let mockDataSource: jest.Mocked<PhoenixDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = new PhoenixDataSource(mockLogger) as jest.Mocked<PhoenixDataSource>;
    (mockDataSource.init as jest.Mock).mockResolvedValue({
      getRepository: mockGetRepository,
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
import "reflect-metadata";
import { DataSource, Repository } from 'typeorm';
import { SaleTransaction } from '../../src/entity/phoenixDb/saleTransaction.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { SaleTransactionProvider } from '../../src/providers/saleTransaction.provider';

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

// Mock TypeORM repository
const mockRepository: Partial<Repository<SaleTransaction>> & { findOne: jest.Mock, createQueryBuilder: jest.Mock } = {
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
    // Add other query builder methods if needed
  }),
};

describe('SaleTransactionProvider', () => {
  let provider: SaleTransactionProvider;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    };

    provider = new SaleTransactionProvider(mockDataSource as DataSource, mockLogger);

    // Mock the trimWhitespace method added by the decorator
    jest.spyOn(provider, 'trimWhitespace').mockImplementation((data) => data);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getTransactionById', () => {
    it('should get a transaction by id', async () => {
      const mockData = {
        CustomerID: 1,
        CustomerName: 'Test Customer',
        AgentId: 101,
        AgentName: 'Test Agent',
        CompanyId: 201,
        CompanyName: 'Test Company',
        ParcelCount: 5,
        BillType: 'Cash',
        SalTrnId: 1,
        Date: new Date(),
        Vno: 123,
        InvNo: 'INV001',
        BillAmount: 1000,
        NetAmount: 900,
        TotalPcs: 10,
        TotalGST: 100,
        CGSTAmount: 50,
        SGSTAmount: 50,
        IGSTAmount: 0,
        Type: 1,
        Series: 'A',
        RefId: 1,
        Book: 'Book1',
        TrnOrigin: 'Origin',
        TrnMode: 'Mode',
        UserName: 'User1',
        IsService: 'No',
        YearStart: new Date(),
        YearENd: new Date(),
      } as SaleTransaction;
      mockRepository.findOne.mockResolvedValue(mockData);

      const result = await provider.getTransactionById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { SalTrnId: 1 },
        relations: ['products'],
      });
      expect(provider.trimWhitespace).toHaveBeenCalledWith(mockData);
    });

    it('should return null on error', async () => {
      const error = new Error('DB Error');
      mockRepository.findOne.mockRejectedValue(error);

      const result = await provider.getTransactionById(1);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith("Error fetching sale transaction:", error);
      expect(provider.trimWhitespace).not.toHaveBeenCalled();
    });

    it('should return null if transaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await provider.getTransactionById(1);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { SalTrnId: 1 },
        relations: ['products'],
      });
      // trimWhitespace should not be called if transaction is null
      expect(provider.trimWhitespace).not.toHaveBeenCalled();
    });
  });
});
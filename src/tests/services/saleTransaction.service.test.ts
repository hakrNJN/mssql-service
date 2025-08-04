// src/tests/services/saleTransaction.service.test.ts
import { SaleTransactionService } from '../../services/saleTransaction.service';
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';
import { SaleTransaction } from '../../entity/phoenixDb/saleTransaction.entity';
import { DataSourceManager } from '../../services/dataSourceManager.service';
import { ILogger } from '../../interface/logger.interface';
import { DataSource } from 'typeorm';

// Mock SaleTransactionProvider
jest.mock('../../providers/saleTransaction.provider');

describe('SaleTransactionService', () => {
  let service: SaleTransactionService;
  let mockSaleTransactionProvider: jest.Mocked<SaleTransactionProvider>;
  let mockDataSourceManager: jest.Mocked<DataSourceManager>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = { getRepository: jest.fn() } as unknown as jest.Mocked<DataSource>;
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockDataSourceManager = { mainDataSource: mockDataSource, phoenixDataSource: mockDataSource, initializeDataSources: jest.fn(), closeDataSources: jest.fn() } as jest.Mocked<DataSourceManager>;

    mockSaleTransactionProvider = new SaleTransactionProvider(mockDataSource, mockLogger) as jest.Mocked<SaleTransactionProvider>;
    mockSaleTransactionProvider.getTransactionById = jest.fn();

    service = new SaleTransactionService(mockDataSourceManager, mockLogger);
    // Manually inject the mocked provider, as it's now created within the service
    (service as any).saleTransactionProvider = mockSaleTransactionProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTransactionById', () => {
    it('should call getTransactionById on the provider', async () => {
      // Provide more complete mock data for SaleTransaction
      const mockTransaction: SaleTransaction = {
        SalTrnId: 1,
        CustomerID: 101,
        CustomerName: 'Test Customer',
        AgentId: 201,
        AgentName: 'Test Agent',
        CompanyId: 301,
        CompanyName: 'Test Company',
        ParcelCount: 1,
        BillType: 'Cash',
        Date: new Date(),
        Vno: 1001,
        InvNo: 'INV001',
        BillAmount: 500,
        NetAmount: 450,
        TotalPcs: 10,
        TotalGST: 50,
        CGSTAmount: 25,
        SGSTAmount: 25,
        IGSTAmount: 0,
        Type: 1,
        Series: 'A',
        RefId: 1,
        Book: 'Sales',
        TrnOrigin: 'Web',
        TrnMode: 'Online',
        UserName: 'testuser',
        IsService: 'N',
        YearStart: new Date(),
        YearENd: new Date(),
        // Add other required properties as per SaleTransaction entity
      } as SaleTransaction;
      mockSaleTransactionProvider.getTransactionById.mockResolvedValue(mockTransaction);
      const result = await service.getTransactionById(1);
      expect(result).toEqual(mockTransaction);
      expect(mockSaleTransactionProvider.getTransactionById).toHaveBeenCalledWith(1);
    });
  });
});
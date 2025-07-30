// src/tests/services/saleTransaction.service.test.ts
import { SaleTransactionService } from '../../services/saleTransaction.service';
import { SaleTransactionProvider } from '../../providers/saleTransaction.provider';
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import { SaleTransaction } from '../../entity/phoenix/SaleTransaction';

// Mock SaleTransactionProvider
jest.mock('../../providers/saleTransaction.provider');

describe('SaleTransactionService', () => {
  let service: SaleTransactionService;
  let mockSaleTransactionProvider: jest.Mocked<SaleTransactionProvider>;
  let mockPhoenixDataSource: jest.Mocked<PhoenixDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPhoenixDataSource = {} as jest.Mocked<PhoenixDataSource>; // Mock PhoenixDataSource
    mockSaleTransactionProvider = new SaleTransactionProvider(mockPhoenixDataSource) as jest.Mocked<SaleTransactionProvider>;
    mockSaleTransactionProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockSaleTransactionProvider.getTransactionById = jest.fn();

    service = new SaleTransactionService(mockPhoenixDataSource);
    // Manually inject the mocked provider
    (service as any).saleTransactionProvider = mockSaleTransactionProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the sale transaction provider repository', async () => {
      await service.initialize();
      expect(mockSaleTransactionProvider.initializeRepository).toHaveBeenCalled();
    });
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
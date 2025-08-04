// src/tests/services/KotakCMS.service.test.ts
import { Vwkotakcmsonline } from '../../entity/anushreeDb/kotakCMS.entity';
import { KotakCMSProvider } from '../../providers/kotakCMS.provider';
import { KotakCMSService } from '../../services/kotakCMS.service';
import { DataSourceManager } from '../../services/dataSourceManager.service';
import { ILogger } from '../../interface/logger.interface';
import { DataSource } from 'typeorm';

// Mock KotakCMSProvider
jest.mock('../../providers/kotakCMS.provider');

describe('KotakCMSService', () => {
  let service: KotakCMSService;
  let mockKotakCMSProvider: jest.Mocked<KotakCMSProvider>;
  let mockDataSourceManager: jest.Mocked<DataSourceManager>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = { getRepository: jest.fn() } as unknown as jest.Mocked<DataSource>;
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockDataSourceManager = { mainDataSource: mockDataSource, phoenixDataSource: mockDataSource, initializeDataSources: jest.fn(), closeDataSources: jest.fn() } as jest.Mocked<DataSourceManager>;

    // Mock the constructor to return a mocked instance with correct arguments
    (KotakCMSProvider as jest.Mock).mockImplementation(() => ({
      getKotakCMSData: jest.fn(),
    }));

    service = new KotakCMSService(mockDataSourceManager, mockLogger);
    // Manually inject the mocked provider, as it's now created within the service
    mockKotakCMSProvider = (service as any).kotakCMSProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKotakCMSData', () => {
    it('should call getKotakCMSData on the provider with correct parameters', async () => {
      // Provide more complete mock data for Vwkotakcmsonline
      const mockData: Vwkotakcmsonline[] = [{
        Client_Code: 'CLI001',
        Product_Code: 'PROD001',
        Payment_Type: 'CASH',
        Payment_Ref_No: 'REF001',
        Payment_Date: new Date(),
        Amount: 1000,
        YearId: 2023,
        Type: 1,
        Conum: 'CON1',
        vno: 1,
        // Add other required properties of Vwkotakcmsonline
      } as Vwkotakcmsonline];
      mockKotakCMSProvider.getKotakCMSData.mockResolvedValue(mockData);

      const fromVno = 1;
      const toVno = 10;
      const conum = 'CON1';
      const yearid = 2023;
      const offset = 0;
      const limit = 10;

      const result = await service.getKotakCMSData(fromVno, toVno, conum, yearid, offset, limit);

      expect(result).toEqual(mockData);
      expect(mockKotakCMSProvider.getKotakCMSData).toHaveBeenCalledWith(
        fromVno, toVno, conum, yearid, offset, limit
      );
    });
  });
});
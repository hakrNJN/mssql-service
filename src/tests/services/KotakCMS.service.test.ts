// src/tests/services/KotakCMS.service.test.ts
import { KotakCMSService } from '../../services/KotakCMS.Service';
import { KotakCMSProvider } from '../../providers/KotakCMS.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { Vwkotakcmsonline } from '../../entity/anushree/KotakCMS.entity';

// Mock KotakCMSProvider
jest.mock('../../providers/KotakCMS.provider');

describe('KotakCMSService', () => {
  let service: KotakCMSService;
  let mockKotakCMSProvider: jest.Mocked<KotakCMSProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource
    mockKotakCMSProvider = new KotakCMSProvider(mockDataSource) as jest.Mocked<KotakCMSProvider>;
    mockKotakCMSProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockKotakCMSProvider.getKotakCMSData = jest.fn();

    service = new KotakCMSService(mockDataSource);
    // Manually inject the mocked provider
    (service as any).kotakCMSProvider = mockKotakCMSProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the KotakCMS provider repository', async () => {
      await service.initialize();
      expect(mockKotakCMSProvider.initializeRepository).toHaveBeenCalled();
    });
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
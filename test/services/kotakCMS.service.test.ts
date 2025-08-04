import "reflect-metadata";
import { KotakCMSService } from '../../src/services/kotakCMS.service';
import { KotakCMSProvider } from '../../src/providers/KotakCMS.provider';
import { DataSourceManager } from '../../src/services/dataSourceManager.service';
import { Vwkotakcmsonline } from '../../src/entity/anushreeDb/kotakCMS.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { WINSTON_LOGGER } from '../../src/utils/logger';
import { container } from 'tsyringe';

// Mock KotakCMSProvider
const mockKotakCMSProvider = {
  getKotakCMSData: jest.fn(),
};

// Mock DataSourceManager
const mockDataSourceManager = {
  mainDataSource: {},
};

// Mock ILogger
const mockLogger: ILogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock tsyringe container to return our mocked logger
jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn((token) => {
      if (token === WINSTON_LOGGER) {
        return mockLogger;
      }
      // Fallback to actual resolve for other dependencies if needed, or throw an error for unmocked ones
      // For this test, we only expect WINSTON_LOGGER to be resolved via the container.
      throw new Error(`Unexpected token resolved: ${String(token)}`);
    }),
  },
  injectable: () => (target: any) => target, // Mock decorator to return the target class unchanged
  inject: () => (target: any, key: string, index?: number) => { // Mock decorator to return the target/key unchanged
    if (index !== undefined) {
      return; // Parameter decorator
    }
    if (key) {
      return; // Property decorator
    }
    return target; // Method decorator
  },
  singleton: () => (target: any) => target, // Mock decorator to return the target class unchanged
}));


describe('KotakCMSService', () => {
  let service: KotakCMSService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Manually inject the mocked provider into the service
    // We need to cast mockDataSourceManager to any because the constructor expects a DataSourceManager instance
    // and we are providing a partial mock.
    service = new KotakCMSService(mockDataSourceManager as any);
    // Override the private property with the mock after instantiation
    (service as any).kotakCMSProvider = mockKotakCMSProvider;
  });

  describe('getKotakCMSData', () => {
    it(`should call the provider's getKotakCMSData method with correct arguments`, async () => {
      const mockResult: Vwkotakcmsonline[] = [{ /* mock data */ } as Vwkotakcmsonline];
      mockKotakCMSProvider.getKotakCMSData.mockResolvedValue(mockResult);

      const fromVno = 1;
      const toVno = 10;
      const conum = 'testCo';
      const yearid = 2023;
      const offset = 0;
      const limit = 5;

      const result = await service.getKotakCMSData(fromVno, toVno, conum, yearid, offset, limit);

      expect(mockKotakCMSProvider.getKotakCMSData).toHaveBeenCalledWith(fromVno, toVno, conum, yearid, offset, limit);
      expect(result).toEqual(mockResult);
    });

    it(`should handle cases where offset and limit are not provided`, async () => {
      const mockResult: Vwkotakcmsonline[] = [{ /* mock data */ } as Vwkotakcmsonline];
      mockKotakCMSProvider.getKotakCMSData.mockResolvedValue(mockResult);

      const fromVno = 1;
      const toVno = 10;
      const conum = 'testCo';
      const yearid = 2023;

      const result = await service.getKotakCMSData(fromVno, toVno, conum, yearid);

      expect(mockKotakCMSProvider.getKotakCMSData).toHaveBeenCalledWith(fromVno, toVno, conum, yearid, undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it(`should return an empty array if the provider returns no data`, async () => {
      mockKotakCMSProvider.getKotakCMSData.mockResolvedValue([]);

      const fromVno = 1;
      const toVno = 10;
      const conum = 'testCo';
      const yearid = 2023;

      const result = await service.getKotakCMSData(fromVno, toVno, conum, yearid);

      expect(mockKotakCMSProvider.getKotakCMSData).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it(`should throw an error if the provider throws an error`, async () => {
      const mockError = new Error('Provider error');
      mockKotakCMSProvider.getKotakCMSData.mockRejectedValue(mockError);

      const fromVno = 1;
      const toVno = 10;
      const conum = 'testCo';
      const yearid = 2023;

      await expect(service.getKotakCMSData(fromVno, toVno, conum, yearid)).rejects.toThrow(mockError);
    });
  });
});

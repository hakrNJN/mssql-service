import "reflect-metadata";
import { SeriesService } from '../../src/services/series.service';
import { SeriesProvider } from '../../src/providers/series.provider';
import { DataSourceManager } from '../../src/services/dataSourceManager.service';
import { SerMst } from '../../src/entity/anushreeDb/series.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { WINSTON_LOGGER } from '../../src/utils/logger';
import { container } from 'tsyringe';

// Mock SeriesProvider
const mockSeriesProvider = {
  getAllSeries: jest.fn(),
  getSeriesById: jest.fn(),
  getAllSeriesWithFilters: jest.fn(),
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
      throw new Error(`Unexpected token resolved: ${String(token)}`);
    }),
  },
  injectable: () => (target: any) => target,
  inject: () => (target: any, key: string, index?: number) => {
    if (index !== undefined) {
      return;
    }
    if (key) {
      return;
    }
    return target;
  },
  singleton: () => (target: any) => target,
}));


describe('SeriesService', () => {
  let service: SeriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Manually inject the mocked provider into the service
    service = new SeriesService(mockDataSourceManager as any, mockLogger);
    // Override the private property with the mock after instantiation
    (service as any).seriesProvider = mockSeriesProvider;
  });

  describe('getAllSeries', () => {
    it(`should call the provider's getAllSeries method and return data`, async () => {
      const mockResult: SerMst[] = [{ id: 1, Name: 'Series A' } as SerMst];
      mockSeriesProvider.getAllSeries.mockResolvedValue(mockResult);

      const result = await service.getAllSeries();

      expect(mockSeriesProvider.getAllSeries).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it(`should return an empty array if the provider returns no data`, async () => {
      mockSeriesProvider.getAllSeries.mockResolvedValue([]);

      const result = await service.getAllSeries();

      expect(mockSeriesProvider.getAllSeries).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it(`should throw an error if the provider throws an error`, async () => {
      const mockError = new Error('Provider error');
      mockSeriesProvider.getAllSeries.mockRejectedValue(mockError);

      await expect(service.getAllSeries()).rejects.toThrow(mockError);
    });
  });

  describe('getSeriesbyId', () => {
    it(`should call the provider's getSeriesById method with correct id`, async () => {
      const mockResult: SerMst = { id: 1, Name: 'Series A' } as SerMst;
      mockSeriesProvider.getSeriesById.mockResolvedValue(mockResult);

      const id = 1;
      const result = await service.getSeriesbyId(id);

      expect(mockSeriesProvider.getSeriesById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResult);
    });

    it(`should return null if the provider returns no data`, async () => {
      mockSeriesProvider.getSeriesById.mockResolvedValue(null);

      const result = await service.getSeriesbyId(1);

      expect(mockSeriesProvider.getSeriesById).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it(`should throw an error if the provider throws an error`, async () => {
      const mockError = new Error('Provider error');
      mockSeriesProvider.getSeriesById.mockRejectedValue(mockError);

      await expect(service.getSeriesbyId(1)).rejects.toThrow(mockError);
    });
  });

  describe('getSeriesWithFilters', () => {
        it(`should call the provider's getAllSeriesWithFilters method with correct arguments`, async () => {
      const mockResult: SerMst[] = [{ id: 1, Name: 'Series A' } as SerMst];
      mockSeriesProvider.getAllSeriesWithFilters.mockResolvedValue(mockResult);

      const filters = { where: { Name: 'Series A' } };
      const result = await service.getSeriesWithFilters(filters);

      expect(mockSeriesProvider.getAllSeriesWithFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });

    it(`should return an empty array if the provider returns no data`, async () => {
      mockSeriesProvider.getAllSeriesWithFilters.mockResolvedValue([]);

      const result = await service.getSeriesWithFilters({});

      expect(mockSeriesProvider.getAllSeriesWithFilters).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it(`should throw an error if the provider throws an error`, async () => {
      const mockError = new Error('Provider error');
      mockSeriesProvider.getAllSeriesWithFilters.mockRejectedValue(mockError);

      await expect(service.getSeriesWithFilters({})).rejects.toThrow(mockError);
    });
  });
});

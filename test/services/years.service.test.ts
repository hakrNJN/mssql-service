import "reflect-metadata";
import { YearService } from '../../src/services/years.service';
import { YearsProvider } from '../../src/providers/years.provider';
import { DataSourceManager } from '../../src/services/dataSourceManager.service';
import { YearMst } from '../../src/entity/anushreeDb/years.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { WINSTON_LOGGER } from '../../src/utils/logger';
import { container } from 'tsyringe';

// Mock YearsProvider
const mockYearsProvider = {
  getAllYearsWithFilters: jest.fn(),
  getYearById: jest.fn(),
  getAllYears: jest.fn(),
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


describe('YearService', () => {
  let service: YearService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Manually inject the mocked provider into the service
    service = new YearService(mockDataSourceManager as any, mockLogger);
    // Override the private property with the mock after instantiation
    (service as any).yearsProvider = mockYearsProvider;
  });

  describe('getYearsWithFilters', () => {
    it('should call the provider's getAllYearsWithFilters method with correct arguments', async () => {
      const mockResult: YearMst[] = [{ id: 1, year: 2023 } as YearMst];
      mockYearsProvider.getAllYearsWithFilters.mockResolvedValue(mockResult);

      const filters = { where: { year: 2023 } };
      const result = await service.getYearsWithFilters(filters);

      expect(mockYearsProvider.getAllYearsWithFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });

    it('should return an empty array if the provider returns no data', async () => {
      mockYearsProvider.getAllYearsWithFilters.mockResolvedValue([]);

      const result = await service.getYearsWithFilters({});

      expect(mockYearsProvider.getAllYearsWithFilters).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw an error if the provider throws an error', async () => {
      const mockError = new Error('Provider error');
      mockYearsProvider.getAllYearsWithFilters.mockRejectedValue(mockError);

      await expect(service.getYearsWithFilters({})).rejects.toThrow(mockError);
    });
  });

  describe('getYearsById', () => {
    it('should call the provider's getYearById method with correct id', async () => {
      const mockResult: YearMst = { id: 1, year: 2023 } as YearMst;
      mockYearsProvider.getYearById.mockResolvedValue(mockResult);

      const id = 1;
      const result = await service.getYearsById(id);

      expect(mockYearsProvider.getYearById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResult);
    });

    it('should return null if the provider returns no data', async () => {
      mockYearsProvider.getYearById.mockResolvedValue(null);

      const result = await service.getYearsById(1);

      expect(mockYearsProvider.getYearById).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should throw an error if the provider throws an error', async () => {
      const mockError = new Error('Provider error');
      mockYearsProvider.getYearById.mockRejectedValue(mockError);

      await expect(service.getYearsById(1)).rejects.toThrow(mockError);
    });
  });

  describe('getYears', () => {
    it('should call the provider's getAllYears method', async () => {
      const mockResult: YearMst[] = [{ id: 1, year: 2023 } as YearMst];
      mockYearsProvider.getAllYears.mockResolvedValue(mockResult);

      const result = await service.getYears();

      expect(mockYearsProvider.getAllYears).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should return null if the provider returns no data', async () => {
      mockYearsProvider.getAllYears.mockResolvedValue(null);

      const result = await service.getYears();

      expect(mockYearsProvider.getAllYears).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should throw an error if the provider throws an error', async () => {
      const mockError = new Error('Provider error');
      mockYearsProvider.getAllYears.mockRejectedValue(mockError);

      await expect(service.getYears()).rejects.toThrow(mockError);
    });
  });
});

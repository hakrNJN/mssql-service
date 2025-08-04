import { SerMst } from '../../src/entity/anushreeDb/series.entity';
import { SeriesProvider } from '../../src/providers/series.provider';
import { applyFilters } from '../../src/utils/query-utils';
import { ILogger } from '../../src/interface/logger.interface';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

// Mock query-utils
jest.mock('../../src/utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

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

describe('SeriesProvider', () => {
  let provider: SeriesProvider;
  let mockSeriesRepository: Partial<Repository<SerMst>> & { find: jest.Mock, findOneBy: jest.Mock };
  let mockDataSource: Partial<DataSource>;
  let mockQueryBuilder: Partial<SelectQueryBuilder<SerMst>> & { getMany: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryBuilder = {
      getMany: jest.fn(),
      // Add other query builder methods if they are used in the provider and need mocking
    };

    mockSeriesRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockSeriesRepository),
    };

    // Instantiate SeriesProvider with mocked dependencies
    provider = new SeriesProvider(
      mockDataSource as DataSource,
      mockLogger
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllSeries', () => {
    it('should get all series', async () => {
      const mockData: SerMst[] = [{ id: 1, Name: 'Test Series' } as SerMst];
      mockSeriesRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllSeries();

      expect(result).toEqual(mockData);
      expect(mockSeriesRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllSeriesWithFilters', () => {
    it('should get series with filters', async () => {
      const mockData: SerMst[] = [{ id: 1, Name: 'Filtered Series' } as SerMst];
      (mockQueryBuilder.getMany as jest.Mock).mockResolvedValue(mockData);
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder); // applyFilters returns the modified queryBuilder

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllSeriesWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(mockSeriesRepository.createQueryBuilder).toHaveBeenCalledWith('series');
      expect(applyFilters).toHaveBeenCalledWith(mockQueryBuilder, filters, 'series');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getSeriesById', () => {
    it('should get a series by id', async () => {
      const mockData: SerMst = { id: 1, Name: 'Test Series' } as SerMst;
      mockSeriesRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getSeriesById(1);

      expect(result).toEqual(mockData);
      expect(mockSeriesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
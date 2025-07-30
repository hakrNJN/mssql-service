
// src/tests/providers/series.provider.test.ts
import { SeriesProvider } from '../../providers/series.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { SerMst } from '../../entity/anushree/series.entity';
import { applyFilters } from '../../utils/query-utils';

// Mock query-utils
jest.mock('../../utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
  }),
};

// Mock AppDataSource
const mockDataSource = {
  init: jest.fn().mockResolvedValue({ getRepository: () => mockRepository }),
};

describe('SeriesProvider', () => {
  let provider: SeriesProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new SeriesProvider(mockDataSourceInstance);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllSeries', () => {
    it('should get all series', async () => {
      const mockData = [new SerMst(), new SerMst()];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllSeries();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllSeriesWithFilters', () => {
    it('should get series with filters', async () => {
      const mockData = [new SerMst(), new SerMst()];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllSeriesWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'series');
    });
  });

  describe('getSeriesById', () => {
    it('should get a series by id', async () => {
      const mockData = new SerMst();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getSeriesById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});

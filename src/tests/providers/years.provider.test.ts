// src/tests/providers/years.provider.test.ts
import { YearsProvider } from '../../providers/years.provider';
import { YearMst } from '../../entity/anushreeDb/years.entity';
import { applyFilters } from '../../utils/query-utils';
import { ILogger } from '../../interface/logger.interface';
import { DataSource, Repository } from 'typeorm';

// Mock query-utils
jest.mock('../../utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock TypeORM repository
const mockRepository: jest.Mocked<Repository<YearMst>> = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
  }),
} as jest.Mocked<Repository<YearMst>>;

describe('YearsProvider', () => {
  let provider: YearsProvider;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    } as unknown as jest.Mocked<DataSource>;

    provider = new YearsProvider(mockDataSource, mockLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllYears', () => {
    it('should get all years', async () => {
      const mockData = [new YearMst(), new YearMst()];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllYears();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllYearsWithFilters', () => {
    it('should get years with filters', async () => {
      const mockData = [new YearMst(), new YearMst()];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: '2023' } };
      const result = await provider.getAllYearsWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'years');
    });
  });

  describe('getYearById', () => {
    it('should get a year by id', async () => {
      const mockData = new YearMst();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getYearById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
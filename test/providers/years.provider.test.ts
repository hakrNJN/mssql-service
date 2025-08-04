import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { YearMst } from '../../src/entity/anushreeDb/years.entity';
import { ILogger } from '../../src/interface/logger.interface';
import { YearsProvider } from '../../src/providers/years.provider';
import { applyFilters } from '../../src/utils/query-utils'; // Corrected import path

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

// Mock TypeORM repository
const mockRepository: any = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
  }),
};

describe('YearsProvider', () => {
  let provider: YearsProvider;
  let mockDataSource: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    };

    provider = new YearsProvider(mockDataSource as DataSource, mockLogger);
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
// src/tests/providers/years.provider.test.ts
import { YearsProvider } from '../../providers/years.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { YearMst } from '../../entity/anushreeDb/years.entity';
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

describe('YearsProvider', () => {
  let provider: YearsProvider;

  beforeEach(async () => {
    jest.clearAllMocks(); // Corrected typo here
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new YearsProvider(mockDataSourceInstance);
    await provider.initializeRepository();
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
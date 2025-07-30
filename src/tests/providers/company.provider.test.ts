
// src/tests/providers/company.provider.test.ts
import { CompanyProvider } from '../../providers/company.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { CompMst } from '../../entity/anushree/company.entity';
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

describe('CompanyProvider', () => {
  let provider: CompanyProvider;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockDataSourceInstance = mockDataSource as unknown as AppDataSource;
    provider = new CompanyProvider(mockDataSourceInstance);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should get all companies', async () => {
      const mockData = [new CompMst(), new CompMst()];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllCompanies();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllCompaniesWithFilters', () => {
    it('should get companies with filters', async () => {
      const mockData = [new CompMst(), new CompMst()];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllCompaniesWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'company');
    });
  });

  describe('getCompanyById', () => {
    it('should get a company by id', async () => {
      const mockData = new CompMst();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getCompanyById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});

// src/tests/providers/company.provider.test.ts
import { CompanyProvider } from '../../providers/company.provider';
import { CompMst } '../../entity/anushreeDb/company.entity';
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
const mockRepository: jest.Mocked<Repository<CompMst>> = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    getMany: jest.fn(),
  }),
} as jest.Mocked<Repository<CompMst>>;

describe('CompanyProvider', () => {
  let provider: CompanyProvider;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      initialize: jest.fn(),
      destroy: jest.fn(),
      isInitialized: true,
    } as unknown as jest.Mocked<DataSource>;

    provider = new CompanyProvider(mockDataSource, mockLogger);
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
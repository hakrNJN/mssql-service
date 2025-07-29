// src/tests/company.provider.test.ts
import { container } from 'tsyringe';
import { CompMst } from '../../entity/anushree/company.entity';
import { CompanyProvider } from '../../providers/company.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import winston from 'winston';
import { applyFilters } from '../../utils/query-utils';

import { WINSTON_LOGGER } from '../../utils/logger';
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });
jest.mock('../../providers/data-source.provider', () => {
  const mockGetRepository = jest.fn();
  return {
    AppDataSource: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue({
        getRepository: mockGetRepository,
      }),
      getRepository: mockGetRepository,
    })),
  };
});

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

describe('CompanyProvider', () => {
  let provider: CompanyProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = {
      init: jest.fn().mockResolvedValue({ getRepository: mockRepository }),
      getRepository: mockRepository,
    } as unknown as jest.Mocked<AppDataSource>;

    provider = new CompanyProvider(mockDataSource);
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
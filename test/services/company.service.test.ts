import "reflect-metadata";
import { CompanyService } from '../../src/services/company.service';
import { CompanyProvider } from '../../src/providers/company.provider';
import { DataSourceManager } from '../../src/services/dataSourceManager.service';
import { ILogger } from '../../src/interface/logger.interface';
import { CompMst } from '../../src/entity/anushreeDb/company.entity';
import { DataSource } from 'typeorm';

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

// Mock CompanyProvider
const mockCompanyProvider = {
  getAllCompaniesWithFilters: jest.fn(),
  getCompanyById: jest.fn(),
  getAllCompanies: jest.fn(),
} as any; // Cast to any to simplify mocking

// Mock DataSourceManager
const mockDataSourceManager = {
  mainDataSource: {} as DataSource, // This will be a mocked DataSource
} as jest.Mocked<DataSourceManager>;

// Mock the CompanyProvider constructor within CompanyService
jest.mock('../../src/providers/company.provider', () => {
  return {
    CompanyProvider: jest.fn().mockImplementation(() => {
      return mockCompanyProvider;
    }),
  };
});

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CompanyService(mockDataSourceManager, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCompaniesWithFilters', () => {
    it('should call companyProvider.getAllCompaniesWithFilters and return the result', async () => {
      const mockCompanies: CompMst[] = [new CompMst()];
      const filters = { Name: { equal: 'Test' } };
      mockCompanyProvider.getAllCompaniesWithFilters.mockResolvedValue(mockCompanies);

      const result = await service.getCompaniesWithFilters(filters);

      expect(mockCompanyProvider.getAllCompaniesWithFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockCompanies);
    });
  });

  describe('getCompanyById', () => {
    it('should call companyProvider.getCompanyById and return the result', async () => {
      const mockCompany = new CompMst();
      mockCompanyProvider.getCompanyById.mockResolvedValue(mockCompany);

      const result = await service.getCompanyById(1);

      expect(mockCompanyProvider.getCompanyById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCompany);
    });
  });

  describe('getCompanies', () => {
    it('should call companyProvider.getAllCompanies and return the result', async () => {
      const mockCompanies: CompMst[] = [new CompMst()];
      mockCompanyProvider.getAllCompanies.mockResolvedValue(mockCompanies);

      const result = await service.getCompanies();

      expect(mockCompanyProvider.getAllCompanies).toHaveBeenCalledWith();
      expect(result).toEqual(mockCompanies);
    });
  });
});
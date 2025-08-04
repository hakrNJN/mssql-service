// src/tests/services/company.service.test.ts
import { CompanyService } from '../../services/company.service';
import { CompanyProvider } from '../../providers/company.provider';
import { CompMst } from '../../entity/anushreeDb/company.entity';
import { Filters, EqualFilter } from '../../types/filter.types';
import { DataSourceManager } from '../../services/dataSourceManager.service';
import { ILogger } from '../../interface/logger.interface';
import { DataSource } from 'typeorm';

// Mock CompanyProvider
jest.mock('../../providers/company.provider');

describe('CompanyService', () => {
  let service: CompanyService;
  let mockCompanyProvider: jest.Mocked<CompanyProvider>;
  let mockDataSourceManager: jest.Mocked<DataSourceManager>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource = { getRepository: jest.fn() } as unknown as jest.Mocked<DataSource>;
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockDataSourceManager = { mainDataSource: mockDataSource, phoenixDataSource: mockDataSource, initializeDataSources: jest.fn(), closeDataSources: jest.fn() } as jest.Mocked<DataSourceManager>;

    mockCompanyProvider = new CompanyProvider(mockDataSource, mockLogger) as jest.Mocked<CompanyProvider>;
    mockCompanyProvider.getAllCompanies = jest.fn();
    mockCompanyProvider.getCompanyById = jest.fn();
    mockCompanyProvider.getAllCompaniesWithFilters = jest.fn();

    service = new CompanyService(mockDataSourceManager, mockLogger);
    // Manually inject the mocked provider, as it's now created within the service
    (service as any).companyProvider = mockCompanyProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('getCompaniesWithFilters', () => {
    it('should call getAllCompaniesWithFilters on the provider', async () => {
      const mockCompanies: CompMst[] = [{ id: 1, Name: 'Filtered Company' } as CompMst];
      const filters: Filters<CompMst> = { Name: { equal: 'Filtered Company' } as EqualFilter<string> };
      mockCompanyProvider.getAllCompaniesWithFilters.mockResolvedValue(mockCompanies);
      const result = await service.getCompaniesWithFilters(filters);
      expect(result).toEqual(mockCompanies);
      expect(mockCompanyProvider.getAllCompaniesWithFilters).toHaveBeenCalledWith(filters);
    });
  });

  describe('getCompanyById', () => {
    it('should call getCompanyById on the provider', async () => {
      const mockCompany: CompMst = { id: 1, Name: 'Company 1' } as CompMst;
      mockCompanyProvider.getCompanyById.mockResolvedValue(mockCompany);
      const result = await service.getCompanyById(1);
      expect(result).toEqual(mockCompany);
      expect(mockCompanyProvider.getCompanyById).toHaveBeenCalledWith(1);
    });
  });

  describe('getCompanies', () => {
    it('should call getAllCompanies on the provider', async () => {
      const mockCompanies: CompMst[] = [{ id: 1, Name: 'Company 1' } as CompMst];
      mockCompanyProvider.getAllCompanies.mockResolvedValue(mockCompanies);
      const result = await service.getCompanies();
      expect(result).toEqual(mockCompanies);
      expect(mockCompanyProvider.getAllCompanies).toHaveBeenCalled();
    });
  });
});
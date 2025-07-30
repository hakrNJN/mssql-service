
// src/tests/services/company.service.test.ts
import { CompanyService } from '../../services/company.service';
import { CompanyProvider } from '../../providers/company.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { CompMst } from '../../entity/anushree/company.entity';
import { Filters, EqualFilter } from '../../types/filter.types';

// Mock CompanyProvider
jest.mock('../../providers/company.provider');

describe('CompanyService', () => {
  let service: CompanyService;
  let mockCompanyProvider: jest.Mocked<CompanyProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource
    mockCompanyProvider = new CompanyProvider(mockDataSource) as jest.Mocked<CompanyProvider>;
    mockCompanyProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockCompanyProvider.getAllCompanies = jest.fn();
    mockCompanyProvider.getCompanyById = jest.fn();
    mockCompanyProvider.getAllCompaniesWithFilters = jest.fn();

    service = new CompanyService(mockDataSource);
    // Manually inject the mocked provider
    (service as any).companyProvider = mockCompanyProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the company provider repository', async () => {
      await service.initialize();
      expect(mockCompanyProvider.initializeRepository).toHaveBeenCalled();
    });
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

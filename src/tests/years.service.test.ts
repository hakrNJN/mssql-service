// src/tests/years.service.test.ts
import { ILogger } from '../interface/logger.interface';
import { AppDataSource } from '../providers/data-source.provider';
import { YearsProvider } from '../providers/years.provider';
import { YearService } from '../services/years.service';

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

// Mock YearsProvider
jest.mock('../providers/years.provider');

describe('YearService', () => {
  let service: YearService;
  let mockYearsProvider: jest.Mocked<YearsProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource
    mockYearsProvider = new YearsProvider(mockDataSource) as jest.Mocked<YearsProvider>;
    mockYearsProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockYearsProvider.getAllYears = jest.fn();
    mockYearsProvider.getYearById = jest.fn();
    mockYearsProvider.getAllYearsWithFilters = jest.fn();

    service = new YearService(mockDataSource);
    // Manually inject the mocked provider
    (service as any).yearsProvider = mockYearsProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the years provider repository', async () => {
      await service.initialize();
      expect(mockYearsProvider.initializeRepository).toHaveBeenCalled();
    });
  });

  describe('getYears', () => {
    it('should call getAllYears on the provider', async () => {
      const mockYears = [{ id: 1, Name: '2023' }];
      mockYearsProvider.getAllYears.mockResolvedValue(mockYears as any);
      const result = await service.getYears();
      expect(result).toEqual(mockYears);
      expect(mockYearsProvider.getAllYears).toHaveBeenCalled();
    });
  });

  describe('getYearsById', () => {
    it('should call getYearById on the provider', async () => {
      const mockYear = { id: 1, Name: '2023' };
      mockYearsProvider.getYearById.mockResolvedValue(mockYear as any);
      const result = await service.getYearsById(1);
      expect(result).toEqual(mockYear);
      expect(mockYearsProvider.getYearById).toHaveBeenCalledWith(1);
    });
  });

  describe('getYearsWithFilters', () => {
    it('should call getAllYearsWithFilters on the provider', async () => {
      const mockYears = [{ id: 1, Name: '2023' }];
      const filters = { Name: { equal: '2023' } };
      mockYearsProvider.getAllYearsWithFilters.mockResolvedValue(mockYears as any);
      const result = await service.getYearsWithFilters(filters);
      expect(result).toEqual(mockYears);
      expect(mockYearsProvider.getAllYearsWithFilters).toHaveBeenCalledWith(filters);
    });
  });
});
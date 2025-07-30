
// src/tests/services/series.service.test.ts
import { SeriesService } from '../../services/series.service';
import { SeriesProvider } from '../../providers/series.provider';
import { AppDataSource } from '../../providers/data-source.provider';
import { SerMst } from '../../entity/anushree/series.entity';
import { Filters, EqualFilter } from '../../types/filter.types';

// Mock SeriesProvider
jest.mock('../../providers/series.provider');

describe('SeriesService', () => {
  let service: SeriesService;
  let mockSeriesProvider: jest.Mocked<SeriesProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource
    mockSeriesProvider = new SeriesProvider(mockDataSource) as jest.Mocked<SeriesProvider>;
    mockSeriesProvider.initializeRepository = jest.fn().mockResolvedValue(undefined);
    mockSeriesProvider.getAllSeriesWithFilters = jest.fn();
    mockSeriesProvider.getSeriesById = jest.fn();

    service = new SeriesService(mockDataSource);
    // Manually inject the mocked provider
    (service as any).seriesProvider = mockSeriesProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize the series provider repository', async () => {
      await service.initialize();
      expect(mockSeriesProvider.initializeRepository).toHaveBeenCalled();
    });
  });

  describe('getAllSeries', () => {
    it('should call getAllSeriesWithFilters on the provider', async () => {
      const mockSeries: SerMst[] = [{ id: 1, Name: 'Series 1' } as SerMst];
      mockSeriesProvider.getAllSeriesWithFilters.mockResolvedValue(mockSeries);
      const result = await service.getAllSeries();
      expect(result).toEqual(mockSeries);
      expect(mockSeriesProvider.getAllSeriesWithFilters).toHaveBeenCalledWith();
    });
  });

  describe('getSeriesbyId', () => {
    it('should call getSeriesById on the provider', async () => {
      const mockSeries: SerMst = { id: 1, Name: 'Series 1' } as SerMst;
      mockSeriesProvider.getSeriesById.mockResolvedValue(mockSeries);
      const result = await service.getSeriesbyId(1);
      expect(result).toEqual(mockSeries);
      expect(mockSeriesProvider.getSeriesById).toHaveBeenCalledWith(1);
    });
  });

  describe('getSeriesWithFilters', () => {
    it('should call getAllSeriesWithFilters on the provider with filters', async () => {
      const mockSeries: SerMst[] = [{ id: 1, Name: 'Filtered Series' } as SerMst];
      const filters: Filters<SerMst> = { Name: { equal: 'Filtered Series' } as EqualFilter<string> };
      mockSeriesProvider.getAllSeriesWithFilters.mockResolvedValue(mockSeries);
      const result = await service.getSeriesWithFilters(filters);
      expect(result).toEqual(mockSeries);
      expect(mockSeriesProvider.getAllSeriesWithFilters).toHaveBeenCalledWith(filters);
    });
  });
});

// src/tests/series.provider.test.ts
import { SerMst } from '../../entity/anushree/series.entity';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';
import { SeriesProvider } from '../../providers/series.provider';
import { applyFilters } from '../../utils/query-utils';

const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  exceptions: jest.fn(),
  rejections: jest.fn(),
  profile: jest.fn(),
  startTimer: jest.fn(),
  transports: [],
  exitOnError: jest.fn(),
  format: jest.fn(),
  levels: jest.fn(),
  level: 'debug',
  silent: jest.fn(),
  configure: jest.fn(),
  defaultMeta: {},
  child: jest.fn(),
  is  : jest.fn(),
};
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
  createQueryBuilder: jest.fn(),
};

describe('SeriesProvider', () => {
  let provider: SeriesProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = new AppDataSource(mockLogger) as jest.Mocked<AppDataSource>;
    (mockDataSource.init as jest.Mock).mockResolvedValue({
      getRepository: mockGetRepository,
    });

    provider = new SeriesProvider(mockDataSource);
    await provider.initializeRepository();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getAllSeries', () => {
    it('should get all series', async () => {
      const mockData = [new SerMst(), new SerMst()];
      mockRepository.find.mockResolvedValue(mockData);

      const result = await provider.getAllSeries();

      expect(result).toEqual(mockData);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAllSeriesWithFilters', () => {
    it('should get series with filters', async () => {
      const mockData = [new SerMst(), new SerMst()];
      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockData),
      };
      (applyFilters as jest.Mock).mockReturnValue(mockQueryBuilder as any);

      const filters = { Name: { equal: 'Test' } };
      const result = await provider.getAllSeriesWithFilters(filters);

      expect(result).toEqual(mockData);
      expect(applyFilters).toHaveBeenCalledWith(expect.any(Object), filters, 'series');
    });
  });

  describe('getSeriesById', () => {
    it('should get a series by id', async () => {
      const mockData = new SerMst();
      mockRepository.findOneBy.mockResolvedValue(mockData);

      const result = await provider.getSeriesById(1);

      expect(result).toEqual(mockData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
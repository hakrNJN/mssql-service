// src/tests/years.provider.test.ts
import { YearMst } from '../../entity/anushree/years.entity';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';
import { YearsProvider } from '../../providers/years.provider';
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
jest.mock('../utils/query-utils', () => ({
  applyFilters: jest.fn(),
}));

// Mock TypeORM repository
const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('YearsProvider', () => {
  let provider: YearsProvider;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockGetRepository = jest.fn().mockReturnValue(mockRepository);
    mockDataSource = new AppDataSource(mockLogger) as jest.Mocked<AppDataSource>;
    (mockDataSource.init as jest.Mock).mockResolvedValue({
      getRepository: mockGetRepository,
    });

    provider = new YearsProvider(mockDataSource);
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

      const filters = { Year: { equal: 2023 } };
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
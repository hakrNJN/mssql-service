// __tests__/years.service.test.ts
import { AppDataSource } from '../providers/data-source.provider';
import winston from 'winston';
import { WINSTON_LOGGER } from '../utils/logger';
import { YearsProvider } from '../providers/years.provider';
import { YearService } from '../services/years.service';

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

describe('YearService', () => {
    let service: YearService;
    let mockYearsProvider: any;
    let mockDataSource: any;

    beforeEach(() => {
        mockDataSource = new AppDataSource(mockLogger);
        service = new YearService(mockDataSource);
        mockYearsProvider = new YearsProvider(mockDataSource);
    });

    it('should get all years successfully', async () => {
        const mockYears = [{ id: 1, year: 2023 }, { id: 2, year: 2024 }];
        jest.mock('../providers/years.provider', () => {
  const mockYearsProviderInstance = {
    initializeRepository: jest.fn(),
    getAllYears: jest.fn(),
    getYearById: jest.fn(),
    getAllYearsWithFilters: jest.fn(),
  };
  return {
    YearsProvider: jest.fn(() => mockYearsProviderInstance),
  };
});
        const yearsProviderInstance = new YearsProvider(mockDataSource)
        service = new YearService(mockDataSource);
        const years = await service.getYears();

        expect(yearsProviderInstance.getAllYears).toHaveBeenCalled();
        expect(years).toEqual(mockYears);
    });

    it('should get a year by ID successfully', async () => {
        const mockYear = { id: 1, year: 2023 };
        (YearsProvider as jest.Mock).mockImplementation(() => {
            return {
                initializeRepository: jest.fn(),
                getAllYears: jest.fn(),
                getYearById: jest.fn().mockResolvedValue(mockYear),
                getAllYearsWithFilters: jest.fn()
            }
        });
        const yearsProviderInstance = new YearsProvider(mockDataSource)
        service = new YearService(mockDataSource);

        const year = await service.getYearsById(1);
        expect(yearsProviderInstance.getYearById).toHaveBeenCalledWith(1);
        expect(year).toEqual(mockYear);
    });
});
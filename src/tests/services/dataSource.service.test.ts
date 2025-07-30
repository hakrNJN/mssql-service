// src/tests/services/dataSource.service.test.ts
import { DataSourceService } from '../../services/dataSource.service';
import { AppDataSource } from '../../providers/data-source.provider';
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import winston from 'winston'; // Import winston for Logger type

// Mock the logger to match winston.Logger interface
const mockLogger: jest.Mocked<winston.Logger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
  // Add other methods if they are used in the service and need mocking
  silent: jest.fn(),
  format: jest.fn(),
  levels: jest.fn(),
  level: 'info',
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  exceptions: jest.fn(),
  rejections: jest.fn(),
  profile: jest.fn(),
  startTimer: jest.fn(),
  unhandleExceptions: jest.fn(),
  unhandleRejections: jest.fn(),
  child: jest.fn(),
  configure: jest.fn(),
  defaultMeta: {}, // Add defaultMeta property
  exitOnError: true, // Add exitOnError property
  transports: [], // Add transports property
} as any; // Cast to any to bypass strict type checking for now

// Mock AppDataSource and PhoenixDataSource
jest.mock('../../providers/data-source.provider', () => {
  return {
    AppDataSource: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});
jest.mock('../../providers/phoenix.data-source.provider', () => {
  return {
    PhoenixDataSource: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe('DataSourceService', () => {
  let service: DataSourceService;
  let mockAppDataSource: jest.Mocked<AppDataSource>;
  let mockPhoenixDataSource: jest.Mocked<PhoenixDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create new instances of the mocked classes for each test
    mockAppDataSource = new AppDataSource(mockLogger) as jest.Mocked<AppDataSource>;
    mockPhoenixDataSource = new PhoenixDataSource(mockLogger) as jest.Mocked<PhoenixDataSource>;

    // Manually inject mocks since tsyringe is not used in tests directly
    service = new DataSourceService(mockAppDataSource, mockPhoenixDataSource, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeDataSources', () => {
    it('should initialize both data sources', async () => {
      await service.initializeDataSources();
      expect(mockAppDataSource.init).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.init).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith("DataSources initialized!");
    });

    it('should handle errors during appDataSource initialization', async () => {
      const mockError = new Error('AppDataSource init failed');
      mockAppDataSource.init.mockRejectedValueOnce(mockError);

      await expect(service.initializeDataSources()).rejects.toThrow(mockError);
      expect(mockAppDataSource.init).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.init).not.toHaveBeenCalled(); // Phoenix init should not be called if App init fails
      expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should handle errors during phoenixDataSource initialization', async () => {
      const mockError = new Error('PhoenixDataSource init failed');
      mockPhoenixDataSource.init.mockRejectedValueOnce(mockError);

      await expect(service.initializeDataSources()).rejects.toThrow(mockError);
      expect(mockAppDataSource.init).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.init).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });

  describe('getAppDataSource', () => {
    it('should return the appDataSource instance', () => {
      expect(service.getAppDataSource()).toBe(mockAppDataSource);
    });
  });

  describe('getPhoenixDataSource', () => {
    it('should return the phoenixDataSource instance', () => {
      expect(service.getPhoenixDataSource()).toBe(mockPhoenixDataSource);
    });
  });
});
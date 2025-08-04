// src/tests/providers/data-source.provider.test.ts
import { DataSourceManager } from '../../services/dataSourceManager.service';
import { ILogger } from '../../interface/logger.interface';
import { DataSource } from 'typeorm';

// Mock the logger
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
} as jest.Mocked<ILogger>;

describe('DataSourceManager', () => {
  let dataSourceManager: DataSourceManager;
  let mockMainDataSource: jest.Mocked<DataSource>;
  let mockPhoenixDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the DataSource instances
    mockMainDataSource = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn().mockResolvedValue(undefined),
      isInitialized: true, // Assume initialized for testing closeDataSources
      getRepository: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    mockPhoenixDataSource = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn().mockResolvedValue(undefined),
      isInitialized: true, // Assume initialized for testing closeDataSources
      getRepository: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    // Mock the createDataSource factory function
    jest.mock('../../providers/data-source.factory', () => ({
      createDataSource: jest.fn((dbName: string) => {
        if (dbName === 'anushree2223') {
          return mockMainDataSource;
        } else if (dbName === 'pheonixDB') {
          return mockPhoenixDataSource;
        }
        return {} as DataSource; // Fallback
      }),
    }));

    // Re-import DataSourceManager after mocking its internal dependency
    const { DataSourceManager: MockedDataSourceManager } = require('../../services/dataSourceManager.service');
    dataSourceManager = new MockedDataSourceManager(mockLogger);
  });

  it('should be defined', () => {
    expect(dataSourceManager).toBeDefined();
  });

  describe('initializeDataSources', () => {
    it('should initialize both data sources', async () => {
      await dataSourceManager.initializeDataSources();
      expect(mockMainDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith("Initializing all data sources...");
      expect(mockLogger.info).toHaveBeenCalledWith("All data sources have been initialized successfully!");
    });

    it('should handle errors during mainDataSource initialization', async () => {
      const mockError = new Error('MainDataSource init failed');
      mockMainDataSource.initialize.mockRejectedValueOnce(mockError);

      await expect(dataSourceManager.initializeDataSources()).rejects.toThrow(mockError);
      expect(mockMainDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.initialize).not.toHaveBeenCalled(); // Phoenix init should not be called if Main init fails
      expect(mockLogger.error).toHaveBeenCalledWith('Error initializing data sources:', mockError);
    });

    it('should handle errors during phoenixDataSource initialization', async () => {
      const mockError = new Error('PhoenixDataSource init failed');
      mockPhoenixDataSource.initialize.mockRejectedValueOnce(mockError);

      await expect(dataSourceManager.initializeDataSources()).rejects.toThrow(mockError);
      expect(mockMainDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith('Error initializing data sources:', mockError);
    });
  });

  describe('closeDataSources', () => {
    it('should close both data sources', async () => {
      await dataSourceManager.closeDataSources();
      expect(mockMainDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith("Closing all data sources...");
      expect(mockLogger.info).toHaveBeenCalledWith("All data sources have been closed.");
    });

    it('should not destroy uninitialized data sources', async () => {
      mockMainDataSource.isInitialized = false;
      mockPhoenixDataSource.isInitialized = false;

      await dataSourceManager.closeDataSources();
      expect(mockMainDataSource.destroy).not.toHaveBeenCalled();
      expect(mockPhoenixDataSource.destroy).not.toHaveBeenCalled();
    });

    it('should handle errors during mainDataSource destruction', async () => {
      const mockError = new Error('MainDataSource destroy failed');
      mockMainDataSource.destroy.mockRejectedValueOnce(mockError);

      await expect(dataSourceManager.closeDataSources()).rejects.toThrow(mockError);
      expect(mockMainDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.destroy).toHaveBeenCalledTimes(1); // Still attempts to destroy other sources
      expect(mockLogger.error).toHaveBeenCalledWith('Error closing data sources:', mockError);
    });
  });

  describe('mainDataSource', () => {
    it('should return the mainDataSource instance', () => {
      expect(dataSourceManager.mainDataSource).toBe(mockMainDataSource);
    });
  });

  describe('phoenixDataSource', () => {
    it('should return the phoenixDataSource instance', () => {
      expect(dataSourceManager.phoenixDataSource).toBe(mockPhoenixDataSource);
    });
  });
});
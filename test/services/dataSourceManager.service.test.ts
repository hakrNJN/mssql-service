import "reflect-metadata";
import { ILogger } from '../../src/interface/logger.interface';

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

// Custom Mock DataSource class to allow setting isInitialized
class MockDataSource {
  isInitialized: boolean;
  initialize: jest.Mock<Promise<any>, any[]>;
  destroy: jest.Mock<Promise<any>, any[]>;
  getRepository = jest.fn();
  createQueryRunner = jest.fn();

  constructor(isInitialized: boolean) {
    this.isInitialized = isInitialized;
    this.initialize = jest.fn().mockResolvedValue(undefined);
    this.destroy = jest.fn().mockResolvedValue(undefined);
  }
}

// Mock the createDataSource factory function at the top level
jest.mock('../../src/providers/data-source.factory', () => ({
  createDataSource: jest.fn((dbName: string) => {
    if (dbName === 'anushree2223') {
      return new MockDataSource(true);
    } else if (dbName === 'pheonixDB') {
      return new MockDataSource(true);
    }
    return new MockDataSource(false); // Fallback
  }),
}));

// Import DataSourceManager AFTER the mocks are defined
import { DataSourceManager } from '../../src/services/dataSourceManager.service';

describe('DataSourceManager', () => {
  let dataSourceManager: DataSourceManager;
  let mockMainDataSource: MockDataSource;
  let mockPhoenixDataSource: MockDataSource;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create new instances of our mock class for each test
    mockMainDataSource = new MockDataSource(true);
    mockPhoenixDataSource = new MockDataSource(true);

    // Re-mock the factory to return these specific instances for the current test
    const createDataSourceMock = require('../../src/providers/data-source.factory').createDataSource;
    createDataSourceMock.mockImplementation((dbName: string) => {
      if (dbName === 'anushree2223') {
        return mockMainDataSource;
      } else if (dbName === 'pheonixDB') {
        return mockPhoenixDataSource;
      }
      return new MockDataSource(false); // Fallback
    });

    // Instantiate DataSourceManager - it should now use the mocked createDataSource
    const { DataSourceManager: OriginalDataSourceManager } = require('../../src/services/dataSourceManager.service');
    dataSourceManager = new OriginalDataSourceManager(mockLogger);

    // Manually assign the mocked data sources to the instance
    // This bypasses the tsyringe injection for testing purposes and ensures the instance uses our mocks
    (dataSourceManager as any).mainDataSource = mockMainDataSource;
    (dataSourceManager as any).phoenixDataSource = mockPhoenixDataSource;
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
    });

    it('should handle errors during phoenixDataSource initialization', async () => {
      const mockError = new Error('PhoenixDataSource init failed');
      mockPhoenixDataSource.initialize.mockRejectedValueOnce(mockError);

      await expect(dataSourceManager.initializeDataSources()).rejects.toThrow(mockError);
    });
  });

  describe('closeDataSources', () => {
    it('should close both data sources', async () => {
      // Ensure data sources are initialized before closing for this test
      mockMainDataSource.isInitialized = true;
      mockPhoenixDataSource.isInitialized = true;
      await dataSourceManager.closeDataSources();
      expect(mockMainDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockPhoenixDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith("Closing all data sources...");
      expect(mockLogger.info).toHaveBeenCalledWith("All data sources have been closed.");
    });

    it('should not destroy uninitialized data sources', async () => {
      // Temporarily set isInitialized to false for this specific test case
      mockMainDataSource.isInitialized = false;
      mockPhoenixDataSource.isInitialized = false;

      await dataSourceManager.closeDataSources();
      expect(mockMainDataSource.destroy).not.toHaveBeenCalled();
      expect(mockPhoenixDataSource.destroy).not.toHaveBeenCalled();

      // Reset isInitialized to true for subsequent tests if needed
      mockMainDataSource.isInitialized = true;
      mockPhoenixDataSource.isInitialized = true;
    });

    it('should handle errors during mainDataSource destruction', async () => {
      // Ensure data sources are initialized before attempting to destroy for this test
      mockMainDataSource.isInitialized = true;
      mockPhoenixDataSource.isInitialized = true;

      const mockError = new Error('MainDataSource destroy failed');
      mockMainDataSource.destroy.mockRejectedValueOnce(mockError);

      await expect(dataSourceManager.closeDataSources()).rejects.toThrow(mockError);
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
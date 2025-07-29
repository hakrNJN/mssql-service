// src/tests/phoenix.data-source.provider.test.ts
import { PhoenixDataSource } from '../../providers/phoenix.data-source.provider';
import { DataSource } from 'typeorm';
import winston from 'winston';

// Mock winston logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;

// Mock TypeORM DataSource
jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    const mockDataSourceInstance = {
      initialize: jest.fn().mockResolvedValue(mockRepository),
      destroy: jest.fn().mockResolvedValue(undefined),
      isInitialized: true,
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };
    return mockDataSourceInstance;
  }),
}));

describe('PhoenixDataSource', () => {
  let phoenixDataSource: PhoenixDataSource;
  let mockTypeOrmDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    phoenixDataSource = new PhoenixDataSource(mockLogger);
  });

  it('should be defined', () => {
    expect(phoenixDataSource).toBeDefined();
  });

  describe('init', () => {
    it('should initialize the data source', async () => {
      const dataSourceInstance = await phoenixDataSource.init();
      mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;

      expect(DataSource).toHaveBeenCalledTimes(1);
      expect(mockTypeOrmDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Phoenix Data Source has been initialized!');
    });

    it('should return the existing instance if already initialized', async () => {
        const firstInstance = await phoenixDataSource.init();
        const secondInstance = await phoenixDataSource.init();
  
        expect(firstInstance).toBe(secondInstance);
        expect(DataSource).toHaveBeenCalledTimes(1);
      });

    it('should handle initialization error', async () => {
      const error = new Error('Init error');
      const mockDs = new (DataSource as jest.Mock<DataSource>)();
      (mockDs.initialize as jest.Mock).mockRejectedValue(error);
      (DataSource as jest.Mock).mockReturnValue(mockDs);

      await expect(phoenixDataSource.init()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error during Phoenix Data Source initialization', error);
    });
  });

  describe('close', () => {
    it('should close the data source', async () => {
      const dataSourceInstance = await phoenixDataSource.init();
      mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;

      await phoenixDataSource.close();

      expect(mockTypeOrmDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Phoenix Data Source has been closed!');
    });

    it('should handle close error', async () => {
        const error = new Error('Close error');
        const dataSourceInstance = await phoenixDataSource.init();
        mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;
        (mockTypeOrmDataSource.destroy as jest.Mock).mockRejectedValue(error);
  
        await expect(phoenixDataSource.close()).rejects.toThrow(error);
        expect(mockLogger.error).toHaveBeenCalledWith('Error during Phoenix Data Source closing', error);
      });

      it('should log an info if closing a non-initialized source', async () => {
        await phoenixDataSource.close();
        expect(mockLogger.info).toHaveBeenCalledWith('Phoenix Data Source was already closed or not initialized.');
      });
  });

  describe('getDataSource', () => {
    it('should return the data source instance', async () => {
      const dataSourceInstance = await phoenixDataSource.init();
      expect(phoenixDataSource.getDataSource()).toBe(dataSourceInstance);
    });

    it('should return null if not initialized', () => {
        expect(phoenixDataSource.getDataSource()).toBeNull();
      });
  });
});

// src/tests/providers/phoenix.data-source.provider.test.ts
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
const mockDataSource = {
  initialize: jest.fn(),
  destroy: jest.fn(),
  isInitialized: false,
};
jest.mock('typeorm', () => ({
  DataSource: jest.fn(() => mockDataSource),
}));

describe('PhoenixDataSource', () => {
  let phoenixDataSource: PhoenixDataSource;

  beforeEach(() => {
    jest.clearAllMocks();
    phoenixDataSource = new PhoenixDataSource(mockLogger);
  });

  it('should be defined', () => {
    expect(phoenixDataSource).toBeDefined();
  });

  describe('init', () => {
    it('should initialize the data source', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await phoenixDataSource.init();
      expect(mockDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Phoenix Data Source has been initialized!');
    });

    it('should return the existing instance if already initialized', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      const firstInstance = await phoenixDataSource.init();
      const secondInstance = await phoenixDataSource.init();
      expect(firstInstance).toBe(secondInstance);
      expect(mockDataSource.initialize).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization error', async () => {
      const error = new Error('Init error');
      mockDataSource.initialize.mockRejectedValue(error);
      await expect(phoenixDataSource.init()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error during Phoenix Data Source initialization', error);
    });
  });

  describe('close', () => {
    it('should close the data source', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await phoenixDataSource.init();
      mockDataSource.destroy.mockResolvedValue(undefined);
      await phoenixDataSource.close();
      expect(mockDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Phoenix Data Source has been closed!');
    });

    it('should handle close error', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await phoenixDataSource.init();
      const error = new Error('Close error');
      mockDataSource.destroy.mockRejectedValue(error);
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
      mockDataSource.initialize.mockResolvedValue(undefined);
      const dataSourceInstance = await phoenixDataSource.init();
      expect(phoenixDataSource.getDataSource()).toBe(dataSourceInstance);
    });

    it('should return null if not initialized', () => {
      expect(phoenixDataSource.getDataSource()).toBeNull();
    });
  });
});

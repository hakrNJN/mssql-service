
// src/tests/providers/data-source.provider.test.ts
import { AppDataSource } from '../../providers/data-source.provider';
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

describe('AppDataSource', () => {
  let appDataSource: AppDataSource;

  beforeEach(() => {
    jest.clearAllMocks();
    appDataSource = new AppDataSource(mockLogger);
  });

  it('should be defined', () => {
    expect(appDataSource).toBeDefined();
  });

  describe('init', () => {
    it('should initialize the data source', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await appDataSource.init();
      expect(mockDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('App Data Source has been initialized!');
    });

    it('should return the existing instance if already initialized', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      const firstInstance = await appDataSource.init();
      const secondInstance = await appDataSource.init();
      expect(firstInstance).toBe(secondInstance);
      expect(mockDataSource.initialize).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization error', async () => {
      const error = new Error('Init error');
      mockDataSource.initialize.mockRejectedValue(error);
      await expect(appDataSource.init()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error during Data Source initialization', error);
    });
  });

  describe('close', () => {
    it('should close the data source', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await appDataSource.init();
      mockDataSource.destroy.mockResolvedValue(undefined);
      await appDataSource.close();
      expect(mockDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Data Source has been closed!');
    });

    it('should handle close error', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      await appDataSource.init();
      const error = new Error('Close error');
      mockDataSource.destroy.mockRejectedValue(error);
      await expect(appDataSource.close()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error during Data Source closing', error);
    });

    it('should log an error if closing a non-initialized source', async () => {
      await appDataSource.close();
      expect(mockLogger.error).toHaveBeenCalledWith('Data Source was already closed or not initialized.');
    });
  });

  describe('getDataSource', () => {
    it('should return the data source instance', async () => {
      mockDataSource.initialize.mockResolvedValue(undefined);
      const dataSourceInstance = await appDataSource.init();
      expect(appDataSource.getDataSource()).toBe(dataSourceInstance);
    });

    it('should return null if not initialized', () => {
      expect(appDataSource.getDataSource()).toBeNull();
    });
  });
});

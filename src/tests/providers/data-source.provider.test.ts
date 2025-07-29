// src/tests/data-source.provider.test.ts
import { container } from 'tsyringe';
import { AppDataSource } from '../../providers/data-source.provider';
import { DataSource } from 'typeorm';
import winston from 'winston';
import { WINSTON_LOGGER } from '../../utils/logger';

// Mock winston logger
const mockLogger: winston.Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as winston.Logger;
container.register<winston.Logger>(WINSTON_LOGGER, { useValue: mockLogger });

// Mock TypeORM DataSource
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
  initialize: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
  isInitialized: false,
  getRepository: jest.fn().mockReturnValue(mockRepository),
};

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => mockDataSourceInstance),
}));

describe('AppDataSource', () => {
  let appDataSource: AppDataSource;
  let mockTypeOrmDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    appDataSource = new AppDataSource(mockLogger);
  });

  it('should be defined', () => {
    expect(appDataSource).toBeDefined();
  });

  describe('init', () => {
    it('should initialize the data source', async () => {
      const dataSourceInstance = await appDataSource.init();
      mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;

      expect(DataSource).toHaveBeenCalledTimes(1);
      expect(mockTypeOrmDataSource.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('App Data Source has been initialized!');
    });

    it('should return the existing instance if already initialized', async () => {
        const firstInstance = await appDataSource.init();
        const secondInstance = await appDataSource.init();
  
        expect(firstInstance).toBe(secondInstance);
        expect(DataSource).toHaveBeenCalledTimes(1); // Still only called once
      });

    it('should handle initialization error', async () => {
      const error = new Error('Init error');
      // To mock the error, we need to get the instance of the mock DataSource
      // and set its initialize method to reject.
      const mockDs = new (DataSource as jest.Mock<DataSource>)();
      (mockDs.initialize as jest.Mock).mockRejectedValue(error);
      (DataSource as jest.Mock).mockReturnValue(mockDs); // Ensure this instance is used

      await expect(appDataSource.init()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error during Data Source initialization', error);
    });
  });

  describe('close', () => {
    it('should close the data source', async () => {
      const dataSourceInstance = await appDataSource.init();
      mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;

      await appDataSource.close();

      expect(mockTypeOrmDataSource.destroy).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Data Source has been closed!');
    });

    it('should handle close error', async () => {
        const error = new Error('Close error');
        const dataSourceInstance = await appDataSource.init();
        mockTypeOrmDataSource = dataSourceInstance as jest.Mocked<DataSource>;
        (mockTypeOrmDataSource.destroy as jest.Mock).mockRejectedValue(error);
  
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
      const dataSourceInstance = await appDataSource.init();
      expect(appDataSource.getDataSource()).toBe(dataSourceInstance);
    });

    it('should return null if not initialized', () => {
        expect(appDataSource.getDataSource()).toBeNull();
      });
  });
});
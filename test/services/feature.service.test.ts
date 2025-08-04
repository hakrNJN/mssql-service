import "reflect-metadata";
import FeaturesService from '../../src/services/feature.service';
import { IFileService, FeatureConfig } from '../../src/interface/feature.interface';
import { ILogger } from '../../src/interface/logger.interface';
import * as fs from 'fs';
jest.mock('fs');
import * as path from 'path';

// Mock fs and path globally

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')), // Simple join for testing paths
  dirname: jest.fn((p) => p.split('/').slice(0, -1).join('/')), // Simple dirname mock
  resolve: jest.fn((...args) => args.join('/')), // Simple resolve mock
  native: { // Mock path.native for compatibility with some libraries
    sep: '/',
    delimiter: ':',
  },
}));

import { AppError } from '../../src/exceptions/appException';

// Mock ILogger
const mockLogger: ILogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as jest.Mocked<ILogger>;

// Mock IFileService
const mockFileService = {
  initialize: jest.fn(),
  model: {
    read: jest.fn(),
  },
} as any;









describe('FeaturesService', () => {
  let service: FeaturesService;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.watchFile as jest.Mock).mockClear();
    // Reset the mock for FileService before each test
    mockFileService.initialize.mockResolvedValue(undefined);
    mockFileService.model.read.mockReturnValue({ featureC: true, featureD: false }); // Default features for tests

    service = new FeaturesService(mockFileService, mockLogger as any);
  });

  

  

  

  describe('initialize', () => {
    it('should load features on initialization', async () => {
      const mockFeatures: FeatureConfig = { featureA: true };
      mockFileService.model.read.mockReturnValue(mockFeatures);

      await service.initialize();

      expect(mockFileService.initialize).toHaveBeenCalledTimes(1);
      expect(mockFileService.model.read).toHaveBeenCalledTimes(1);
      expect(service.getFeatures()).toEqual(mockFeatures);
    });

    it('should handle errors during feature loading', async () => {
      const mockError = new Error('Failed to load');
      mockFileService.initialize.mockRejectedValue(mockError);

      await expect(service.initialize()).rejects.toThrow(new AppError(500, "Unable to load features configuration"));
      expect(mockLogger.error).toHaveBeenCalledWith('Error loading features in FeaturesService:', mockError);
    });
  });

  describe('reloadFeatures (private method)', () => {
    it('should reload features when file changes', async () => {
      const initialFeatures: FeatureConfig = { featureA: true };
      const reloadedFeatures: FeatureConfig = { featureB: false };

      mockFileService.model.read.mockReturnValueOnce(initialFeatures);
      await service.initialize(); // Load initial features

      mockFileService.model.read.mockReturnValueOnce(reloadedFeatures);

      // Simulate file change
      const watchFileCallback = (fs.watchFile as jest.Mock).mock.calls[0][1];
      await watchFileCallback({ mtimeMs: 123 }, { mtimeMs: 456 }); // curr.mtimeMs !== prev.mtimeMs

      expect(mockLogger.info).toHaveBeenCalledWith('Feature config file changed. Reloading features...');
      expect(mockFileService.initialize).toHaveBeenCalledTimes(2); // Called again for reload
      expect(mockFileService.model.read).toHaveBeenCalledTimes(2); // Called again for reload
      expect(service.getFeatures()).toEqual(reloadedFeatures);
      expect(mockLogger.info).toHaveBeenCalledWith('Features reloaded successfully.');
    });

    it('should log error if reloading fails after file change', async () => {
      const mockError = new Error('Reload failed');
      mockFileService.model.read.mockReturnValueOnce({}); // Initial load
      await service.initialize();

      mockFileService.initialize.mockRejectedValueOnce(mockError); // Simulate reload failure

      const watchFileCallback = (fs.watchFile as jest.Mock).mock.calls[0][1];
      await watchFileCallback({ mtimeMs: 123 }, { mtimeMs: 456 });

      expect(mockLogger.error).toHaveBeenCalledWith('Error reloading features after file change:', mockError);
      expect(mockLogger.info).not.toHaveBeenCalledWith('Features reloaded successfully.');
    });

    it('should not reload features if file mtimeMs is the same', async () => {
      const initialFeatures: FeatureConfig = { featureA: true };
      mockFileService.model.read.mockReturnValueOnce(initialFeatures);
      await service.initialize();

      // Simulate file change with same mtimeMs
      const watchFileCallback = (fs.watchFile as jest.Mock).mock.calls[0][1];
      await watchFileCallback({ mtimeMs: 123 }, { mtimeMs: 123 }); // curr.mtimeMs === prev.mtimeMs

      expect(mockLogger.info).not.toHaveBeenCalledWith('Feature config file changed. Reloading features...');
      expect(mockFileService.initialize).toHaveBeenCalledTimes(1); // Only initial load
      expect(mockFileService.model.read).toHaveBeenCalledTimes(1); // Only initial load
      expect(service.getFeatures()).toEqual(initialFeatures);
    });
  });

  describe('getFeatures', () => {
    it('should return the current features', async () => {
      const mockFeatures: FeatureConfig = { featureC: true, featureD: false };
      mockFileService.model.read.mockReturnValue(mockFeatures);
      await service.initialize();

      const result = service.getFeatures();
      expect(result).toEqual(mockFeatures);
    });
  });

  describe('isFeatureEnabled', () => {
    beforeEach(async () => {
      const mockFeatures: FeatureConfig = { enabledFeature: true, disabledFeature: false, missingFeature: undefined };
      mockFileService.model.read.mockReturnValue(mockFeatures);
      await service.initialize();
    });

    it('should return true for an enabled feature', () => {
      expect(service.isFeatureEnabled('enabledFeature')).toBe(true);
    });

    it('should return false for a disabled feature', () => {
      expect(service.isFeatureEnabled('disabledFeature')).toBe(false);
    });

    it('should return false for a missing feature', () => {
      expect(service.isFeatureEnabled('nonExistentFeature')).toBe(false);
    });
  });

  describe('getQueueName', () => {
    beforeEach(async () => {
      const mockFeatures: FeatureConfig = {
        queueNames: {
          queueA: 'queue_a_name',
          queueB: 'queue_b_name',
        },
      };
      mockFileService.model.read.mockReturnValue(mockFeatures);
      await service.initialize();
    });

    it('should return the correct queue name for an existing key', () => {
      expect(service.getQueueName('queueA')).toBe('queue_a_name');
    });

    it('should return undefined for a non-existing key', () => {
      expect(service.getQueueName('queueC')).toBeUndefined();
    });

    it('should return undefined if queueNames is not an object', async () => {
      mockFileService.model.read.mockReturnValueOnce({ queueNames: 'not_an_object' });
      await service.initialize();
      expect(service.getQueueName('queueA')).toBeUndefined();
    });

    it('should return undefined if queueNames is missing', async () => {
      mockFileService.model.read.mockReturnValueOnce({});
      await service.initialize();
      expect(service.getQueueName('queueA')).toBeUndefined();
    });
  });
});
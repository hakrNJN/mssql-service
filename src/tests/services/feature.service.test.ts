
// src/tests/services/feature.service.test.ts
import FeaturesService from '../../services/feature.service';
import FileService from '../../providers/fileService.provider';
import { ILogger } from '../../interface/logger.interface';
import * as fs from 'fs';
import { AppError } from '../../exceptions/appException';
import winston from 'winston';
import { IFeaturesModel } from '../../interface/feature.interface';

// Mock the logger
const mockLogger: jest.Mocked<winston.Logger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
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
} as any;

// Mock FileService
jest.mock('../../providers/fileService.provider', () => {
  return {
    __esModule: true, // This is important for mocking default exports
    default: jest.fn().mockImplementation(() => {
      return {
        filePath: 'mock/path/to/feature.config.yml',
        model: {
          read: jest.fn(),
          add: jest.fn(),
          edit: jest.fn(),
          delete: jest.fn(),
        } as IFeaturesModel,
        initialize: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

// Mock fs module
jest.mock('fs', () => ({
  watchFile: jest.fn(),
  unwatchFile: jest.fn(),
}));

describe('FeaturesService', () => {
  let service: FeaturesService;
  let mockFileService: jest.Mocked<FileService>;

  const mockFeatureConfig = {
    featureA: true,
    featureB: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked FileService constructor
    const MockedFileService = require('../../providers/fileService.provider').default;
    // Create an instance of the mocked FileService
    mockFileService = new MockedFileService('mock/path/to/feature.config.yml', mockLogger) as jest.Mocked<FileService>;

    // Set the mock implementation for read method
    (mockFileService.model.read as jest.Mock).mockReturnValue(mockFeatureConfig);

    // Manually inject mocks
    service = new FeaturesService(mockFileService, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should load features on initialization', async () => {
      await service.initialize();
      expect(mockFileService.initialize).toHaveBeenCalledTimes(1);
      expect(mockFileService.model.read).toHaveBeenCalledTimes(1);
      expect(service.getFeatures()).toEqual(mockFeatureConfig);
    });

    it('should handle errors during feature loading', async () => {
      mockFileService.initialize.mockRejectedValueOnce(new Error('File service init error'));
      await expect(service.initialize()).rejects.toThrow(AppError);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('getFeatures', () => {
    it('should return the current feature configuration', async () => {
      await service.initialize();
      expect(service.getFeatures()).toEqual(mockFeatureConfig);
    });
  });

  describe('isFeatureEnabled', () => {
    beforeEach(async () => {
      await service.initialize(); // Ensure features are loaded
    });

    it('should return true if feature is enabled', () => {
      expect(service.isFeatureEnabled('featureA')).toBe(true);
    });

    it('should return false if feature is disabled', () => {
      expect(service.isFeatureEnabled('featureB')).toBe(false);
    });

    it('should return false if feature does not exist', () => {
      expect(service.isFeatureEnabled('nonExistentFeature')).toBe(false);
    });
  });

  describe('file watcher', () => {
    it('should set up a file watcher on initialization', () => {
      expect(fs.watchFile).toHaveBeenCalledTimes(1);
      expect(fs.watchFile).toHaveBeenCalledWith(
        expect.stringContaining('feature.config.yml'),
        { interval: 1000 },
        expect.any(Function)
      );
    });

    it('should reload features when the file changes', async () => {
      // Simulate initial load
      await service.initialize();
      expect(mockFileService.model.read).toHaveBeenCalledTimes(1);

      // Simulate file change
      const watcherCallback = (fs.watchFile as jest.Mock).mock.calls[0][2];
      const newFeatureConfig = { featureC: true };
      // Use mockImplementationOnce for the next call to read
      (mockFileService.model.read as jest.Mock).mockImplementationOnce(() => newFeatureConfig);

      // Call the watcher callback with different mtimeMs to simulate a change
      await watcherCallback({ mtimeMs: 12345 }, { mtimeMs: 1234 }); 

      expect(mockLogger.info).toHaveBeenCalledWith('Feature config file changed. Reloading features...');
      expect(mockFileService.initialize).toHaveBeenCalledTimes(2); // Called again for reload
      expect(mockFileService.model.read).toHaveBeenCalledTimes(2); // Read again for reload
      expect(service.getFeatures()).toEqual(newFeatureConfig);
      expect(mockLogger.info).toHaveBeenCalledWith('Features reloaded successfully.');
    });

    it('should log an error if reloading features fails after file change', async () => {
      // Simulate initial load
      await service.initialize();

      // Simulate file change leading to an error
      const watcherCallback = (fs.watchFile as jest.Mock).mock.calls[0][2];
      mockFileService.initialize.mockRejectedValueOnce(new Error('Reload error'));

      await watcherCallback({ mtimeMs: 12345 }, { mtimeMs: 1234 });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error reloading features after file change:',
        expect.any(Error)
      );
    });
  });
});

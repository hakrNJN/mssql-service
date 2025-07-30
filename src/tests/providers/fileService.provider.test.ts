// src/tests/providers/fileService.provider.test.ts
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { ILogger } from '../../interface/logger.interface';
import FileService from '../../providers/fileService.provider';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock js-yaml
jest.mock('js-yaml', () => ({
  load: jest.fn(),
  dump: jest.fn(),
}));

describe('FileService', () => {
  let fileService: FileService;
  let mockLogger: ILogger;
  const filePath = 'test.yaml';

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      http: jest.fn(),
      silly: jest.fn(),
    };
    fileService = new FileService(filePath, mockLogger);
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize from a YAML file', async () => {
      const fileContent = 'featureA: true\nfeatureB: false';
      const parsedContent = { featureA: true, featureB: false };
      (fs.readFile as jest.Mock).mockResolvedValue(fileContent);
      (yaml.load as jest.Mock).mockReturnValue(parsedContent);

      await fileService.initialize();

      expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf8');
      expect(yaml.load).toHaveBeenCalledWith(fileContent);
      expect(fileService.model.read()).toEqual(parsedContent);
    });

    it('should handle file read error and log it', async () => {
      const error = new Error('File not found');
      (fs.readFile as jest.Mock).mockRejectedValue(error);

      await expect(fileService.initialize()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error initializing FileService:', error);
    });
  });

  describe('save', () => {
    it('should save data to a YAML file', async () => {
      const data = { featureA: true, featureB: true };
      const yamlString = 'featureA: true\nfeatureB: true';
      fileService.model.add('featureA', true);
      fileService.model.add('featureB', true);
      (yaml.dump as jest.Mock).mockReturnValue(yamlString);

      await fileService.save();

      expect(yaml.dump).toHaveBeenCalledWith(data);
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, yamlString, 'utf8');
    });

    it('should handle file write error and log it', async () => {
      const error = new Error('Permission denied');
      (fs.writeFile as jest.Mock).mockRejectedValue(error);

      await expect(fileService.save()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Error saving FileService:', error);
    });
  });
});
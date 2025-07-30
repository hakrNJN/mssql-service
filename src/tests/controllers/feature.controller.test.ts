// src/tests/controllers/feature.controller.test.ts
import { NextFunction, Request, Response } from 'express';
import FeatureController from '../../controllers/feature.controller';
import FeaturesService from '../../services/feature.service';
import FileService from '../../providers/fileService.provider';
import FeaturesModel from '../../model/feature.model';
import { ILogger } from '../../interface/logger.interface';
import * as winston from 'winston';

// Mock dependencies
jest.mock('../../services/feature.service');
jest.mock('../../providers/fileService.provider');
jest.mock('../../model/feature.model');

describe('FeatureController', () => {
  let controller: FeatureController;
  let mockService: jest.Mocked<FeaturesService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockFileService: jest.Mocked<FileService>;
  let mockModel: jest.Mocked<FeaturesModel>;
  let mockLogger: winston.Logger;

  beforeEach(() => {
    mockModel = new FeaturesModel() as jest.Mocked<FeaturesModel>;
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      http: jest.fn(),
      silly: jest.fn(),
    } as unknown as winston.Logger;

    // Provide a default filePath and mockLogger
    mockFileService = new FileService('dummy/path/to/config.yml', mockLogger) as jest.Mocked<FileService>;
    mockFileService.model = mockModel;
    mockFileService.initialize = jest.fn().mockResolvedValue(undefined);
    mockFileService.save = jest.fn().mockResolvedValue(undefined);

    // Mock the constructor of FeaturesService to avoid dependency injection issues
    mockService = new FeaturesService(mockFileService, mockLogger) as jest.Mocked<FeaturesService>;
    mockService.fileService = mockFileService; // Assign the mocked fileService

    controller = new FeatureController(mockService);

    mockRequest = {
      method: 'GET',
      body: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should call initialize on fileService', async () => {
      await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockFileService.initialize).toHaveBeenCalled();
    });

    it('should call next with an error if initialize fails', async () => {
      const error = new Error('Initialization failed');
      mockFileService.initialize.mockRejectedValue(error);
      await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    describe('GET request', () => {
      it('should get features and return them', async () => {
        const features = { feature1: true };
        mockModel.read = jest.fn().mockReturnValue(features);
        mockRequest.method = 'GET';

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockModel.read).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: features });
      });
    });

    describe('POST request', () => {
      it('should add a feature and save', async () => {
        mockRequest.method = 'POST';
        mockRequest.body = { servicename: 'newFeature', value: true };

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockModel.add).toHaveBeenCalledWith('newFeature', true);
        expect(mockFileService.save).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
      });

      it('should return 400 if servicename or value is missing', async () => {
        mockRequest.method = 'POST';
        mockRequest.body = { servicename: 'newFeature' }; // Missing value

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          success: false,
          message: 'Invalid request body. servicename (string) and value (boolean) are required.',
        });
      });
    });

    describe('PUT request', () => {
      it('should edit a feature and save', async () => {
        mockRequest.method = 'PUT';
        mockRequest.body = { servicename: 'existingFeature', value: false };

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockModel.edit).toHaveBeenCalledWith('existingFeature', false);
        expect(mockFileService.save).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
      });

      it('should return 404 if feature to edit is not found', async () => {
        const error = new Error('Key not found');
        mockModel.edit.mockImplementation(() => {
          throw error;
        });
        mockRequest.method = 'PUT';
        mockRequest.body = { servicename: 'nonExistingFeature', value: true };

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Key not found' });
      });
    });

    describe('DELETE request', () => {
      it('should delete a feature and save', async () => {
        mockRequest.method = 'DELETE';
        mockRequest.body = { servicename: 'featureToDelete' };

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockModel.delete).toHaveBeenCalledWith('featureToDelete');
        expect(mockFileService.save).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
      });

      it('should return 404 if feature to delete is not found', async () => {
        const error = new Error('Key not found');
        mockModel.delete.mockImplementation(() => {
          throw error;
        });
        mockRequest.method = 'DELETE';
        mockRequest.body = { servicename: 'nonExistingFeature' };

        await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Key not found' });
      });
    });

    it('should call next with an error for an invalid method', async () => {
      mockRequest.method = 'PATCH'; // Invalid method

      await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Invalid request method'));
    });
  });
});
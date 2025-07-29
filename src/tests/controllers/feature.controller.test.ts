// src/tests/feature.controller.test.ts
import { NextFunction, Request, Response } from 'express';
import FeatureController from '../../controllers/feature.controller';
import FeaturesModel from '../../model/feature.model';
import FileService from '../../providers/fileService.provider';
import FeaturesService from '../../services/feature.service';

// Mock FeaturesService and its dependencies
jest.mock('../../services/feature.service');
jest.mock('../../providers/fileService.provider');
jest.mock('../../model/feature.model');

describe('FeatureController', () => {
  let controller: FeatureController;
  let mockService: jest.Mocked<FeaturesService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Mock the nested properties on FeaturesService
    const mockModel = new FeaturesModel() as jest.Mocked<FeaturesModel>;
    const mockFileServiceInstance: jest.Mocked<FileService> = {
      filePath: '',
      model: mockModel,
      initialize: jest.fn(),
      save: jest.fn(),
    };
    const mockLogger: jest.Mocked<winston.Logger> = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;
    mockService = new FeaturesService(mockFileServiceInstance, mockLogger) as jest.Mocked<FeaturesService>;

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should call the correct handler based on method', async () => {
      mockRequest.method = 'POST';
      mockRequest.body = { servicename: 'test', value: true };

      await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.fileService.model.add).toHaveBeenCalledWith('test', true);
      expect(mockService.fileService.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });

    it('should call next with an error if handler throws', async () => {
      const error = new Error('Test error');
      (mockService.fileService.initialize as jest.Mock).mockRejectedValue(error);

      await controller.handleRequest(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // You can also test the private methods indirectly through handleRequest
  // or use a type assertion to access them for direct testing if needed.
});
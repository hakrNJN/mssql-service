// src/tests/controllers/series.controller.test.ts
import { ILogger } from '../../interface/logger.interface';

// Mock SeriesService and ApiResponse
jest.mock('../../services/series.service');
jest.mock('../../utils/api-response');

describe('SeriesController', () => {
  let controller: SeriesController;
  let mockService: jest.Mocked<SeriesService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockService = new SeriesService(null as any, null as any) as jest.Mocked<SeriesService>; // Updated to match new constructor
    mockService.getAllSeries = jest.fn();
    mockService.getSeriesbyId = jest.fn();
    mockService.getSeriesWithFilters = jest.fn();

    controller = new SeriesController(mockService, mockLogger);
    mockRequest = {
      query: {},
      params: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSeries', () => {
    it('should return all series', async () => {
      const mockData = [{ id: 1 }];
      mockService.getAllSeries.mockResolvedValue(mockData as any);

      await controller.getAllSeries(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'All Avalable Series Retrived',
      });
    });
  });

  describe('getSeriesById', () => {
    it('should return a series by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: 1 };
      mockService.getSeriesbyId.mockResolvedValue(mockData as any);

      await controller.getSeriesById(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Series retrived for id 1',
      });
    });
  });

  describe('getIrnSeries', () => {
    it('should return IRN series', async () => {
      mockRequest.query = { yearid: '2023', type: 'D', company: '1' };
      const mockData = [{ id: 1 }];
      mockService.getSeriesWithFilters.mockResolvedValue(mockData as any);

      await controller.getIrnSeries(mockRequest as Request, mockResponse as Response);

      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'IRN Series retrived',
      });
    });

    it('should throw BadRequest if company is missing', async () => {
      mockRequest.query = { yearid: '2023', type: 'D' };

      await expect(controller.getIrnSeries(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.BadRequest('Company is required')
      );
    });
  });
});
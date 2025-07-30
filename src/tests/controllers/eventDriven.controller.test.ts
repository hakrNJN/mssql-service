
// src/tests/controllers/eventDriven.controller.test.ts
import EventDrivenController from '../../controllers/eventDriven.controller';
import { ILogger } from '../../interface/logger.interface';
import * as winston from 'winston';
import FeaturesService from '../../services/feature.service';
import PublisherRabbitMQService from '../../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../../services/rabbitMQ.service';

// Mock services
jest.mock('../../services/rabbitMQ.service');
jest.mock('../../services/publisher.RabbitMQ.service');
jest.mock('../../services/feature.service');

// Mock the logger
const mockLogger: winston.Logger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
} as unknown as winston.Logger;

describe('EventDrivenController', () => {
  let controller: EventDrivenController;
  let mockRabbitMQClient: jest.Mocked<RabbitMQClientService>;
  let mockPublisherService: jest.Mocked<PublisherRabbitMQService>;
  let mockFeaturesService: jest.Mocked<FeaturesService>;

  beforeEach(() => {
    // Correctly instantiate mocked services with all required constructor arguments
    mockRabbitMQClient = new RabbitMQClientService({} as any, mockLogger) as jest.Mocked<RabbitMQClientService>;
    mockPublisherService = new PublisherRabbitMQService(mockRabbitMQClient, mockLogger) as jest.Mocked<PublisherRabbitMQService>;
    mockFeaturesService = new FeaturesService({} as any, mockLogger) as jest.Mocked<FeaturesService>;

    controller = new EventDrivenController(
      mockRabbitMQClient,
      mockPublisherService,
      mockFeaturesService,
      mockLogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize services', async () => {
      await controller.initialize();
      expect(mockRabbitMQClient.init).toHaveBeenCalled();
      expect(mockFeaturesService.initialize).toHaveBeenCalled();
    });
  });

  describe('startEventListeners', () => {
    it('should start listeners based on feature flags', async () => {
      mockFeaturesService.isFeatureEnabled.mockImplementation((feature) => {
        return feature === 'fetchDataEnabled'; // Only enable fetchData
      });

      // Spy on the private methods
      const fetchDataSpy = jest.spyOn(controller as any, 'fetchData').mockImplementation(() => Promise.resolve());
      const fetchRegisterSpy = jest.spyOn(controller as any, 'fetchRegister').mockImplementation(() => Promise.resolve());

      await controller.startEventListeners();

      expect(fetchDataSpy).toHaveBeenCalled();
      expect(fetchRegisterSpy).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close connections', async () => {
      await controller.close();
      expect(mockRabbitMQClient.close).toHaveBeenCalled();
      expect(mockPublisherService.closeConnection).toHaveBeenCalled();
    });
  });
});

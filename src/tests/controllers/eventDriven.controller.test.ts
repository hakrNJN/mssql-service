// src/tests/eventDriven.controller.test.ts
import { container } from 'tsyringe';
import EventDrivenController from '../../controllers/eventDriven.controller';
import { ILogger } from '../../interface/logger.interface';
import FeaturesService from '../../services/feature.service';
import PublisherRabbitMQService from '../../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../../services/rabbitMQ.service';
import { WINSTON_LOGGER } from '../../utils/logger';

// Mock the logger
const mockLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
container.register<ILogger>(WINSTON_LOGGER, { useValue: mockLogger });

// Mock services
jest.mock('../services/rabbitMQ.service');
jest.mock('../services/publisher.RabbitMQ.service');
jest.mock('../services/feature.service');

describe('EventDrivenController', () => {
  let controller: EventDrivenController;
  let mockRabbitMQClient: jest.Mocked<RabbitMQClientService>;
  let mockPublisherService: jest.Mocked<PublisherRabbitMQService>;
  let mockFeaturesService: jest.Mocked<FeaturesService>;

  beforeEach(() => {
    mockRabbitMQClient = new RabbitMQClientService('') as jest.Mocked<RabbitMQClientService>;
    mockPublisherService = new PublisherRabbitMQService(mockRabbitMQClient) as jest.Mocked<PublisherRabbitMQService>;
    mockFeaturesService = new FeaturesService('', mockLogger) as jest.Mocked<FeaturesService>;

    controller = new EventDrivenController(
      mockRabbitMQClient,
      mockPublisherService,
      mockFeaturesService,
      mockLogger
    );
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
      const fetchDataSpy = jest.spyOn(controller as any, 'fetchData');
      const fetchRegisterSpy = jest.spyOn(controller as any, 'fetchRegister');

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
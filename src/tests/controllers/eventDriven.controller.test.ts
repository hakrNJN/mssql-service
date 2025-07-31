
// src/tests/controllers/eventDriven.controller.test.ts
import EventDrivenController from '../../controllers/eventDriven.controller';


import * as winston from 'winston';
import FeaturesService from '../../services/feature.service';
import PublisherRabbitMQService from '../../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../../services/rabbitMQ.service';



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
    mockRabbitMQClient = {
      init: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      consume: jest.fn(),
      publish: jest.fn(),
      sendToQueue: jest.fn(),
      getChannel: jest.fn(),
      getConnection: jest.fn(),
    } as unknown as jest.Mocked<RabbitMQClientService>;

    mockPublisherService = {
      initialize: jest.fn().mockResolvedValue(undefined),
      publish: jest.fn().mockResolvedValue(undefined),
      closeConnection: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<PublisherRabbitMQService>;

    mockFeaturesService = {
      initialize: jest.fn().mockResolvedValue(undefined),
      isFeatureEnabled: jest.fn().mockImplementation((feature: string) => {
        if (feature === 'enableRabbitMQ') return true;
        return false;
      }),
      getFeatureConfig: jest.fn().mockReturnValue({
        enableRabbitMQ: true,
        fetchDataEnabled: true,
        fetchRegisterEnabled: true,
        queueNames: {
          fetchDataQueue: 'testFetchDataQueue',
          validateQueue: 'testValidateQueue',
          fetchRegisterQueue: 'testFetchRegisterQueue',
          registerValidateQueue: 'testRegisterValidateQueue',
        },
      }),
    } as unknown as jest.Mocked<FeaturesService>;

    controller = new EventDrivenController(
      mockRabbitMQClient,
      mockPublisherService,
      mockFeaturesService,
      mockLogger
    );

    // Spy on the methods of the actual controller instance
    jest.spyOn(controller as any, 'fetchData').mockImplementation(() => Promise.resolve());
    jest.spyOn(controller as any, 'fetchRegister').mockImplementation(() => Promise.resolve());
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
        return feature === 'fetchDataEnabled' || feature === 'enableRabbitMQ'; // Enable fetchData and RabbitMQ
      });

      await controller.startEventListeners();

      expect((controller as any).fetchData).toHaveBeenCalled();
      expect((controller as any).fetchRegister).not.toHaveBeenCalled();
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


// src/tests/services/publisher.RabbitMQ.service.test.ts
import PublisherRabbitMQService from '../../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../../services/rabbitMQ.service';
import { ILogger } from '../../interface/logger.interface';
import * as amqp from 'amqplib';
import { Message, MessageProperties } from '../../types/message.types';

// Mock the logger
const mockLogger: ILogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  http: jest.fn(),
  silly: jest.fn(),
};

// Mock RabbitMQClientService
jest.mock('../../services/rabbitMQ.service', () => {
  return {
    __esModule: true, // This is important for mocking default exports
    default: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        init: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe('PublisherRabbitMQService', () => {
  let service: PublisherRabbitMQService;
  let mockRabbitMQClient: jest.Mocked<RabbitMQClientService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked RabbitMQClientService constructor
    const MockedRabbitMQClientService = require('../../services/rabbitMQ.service').default;
    // Create an instance of the mocked RabbitMQClientService with a dummy options object and the mockLogger
    mockRabbitMQClient = new MockedRabbitMQClientService({ connectionUrl: 'amqp://localhost' }, mockLogger) as jest.Mocked<RabbitMQClientService>;

    // Manually inject mocks
    service = new PublisherRabbitMQService(mockRabbitMQClient, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a message with default properties if none provided', () => {
      const messageBody = { data: 'test' };
      const message = service.createMessage(undefined, messageBody);
      expect(message).toEqual({
        properties: { headers: {} },
        body: messageBody,
      });
    });

    it('should create a message with provided properties', () => {
      const messageBody = { data: 'test' };
      // Ensure all required properties of amqp.MessageProperties are present
      const properties: amqp.MessageProperties = {
        headers: { 'x-custom': 'value' },
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        deliveryMode: undefined,
        priority: undefined,
        correlationId: undefined,
        replyTo: undefined,
        expiration: undefined,
        messageId: undefined,
        timestamp: undefined,
        type: undefined,
        userId: undefined,
        appId: undefined,
        clusterId: undefined, // Added missing property
      };
      const message = service.createMessage(properties, messageBody);
      expect(message).toEqual({
        properties: properties,
        body: messageBody,
      });
    });

    it('should create a message with undefined body if not provided', () => {
      // Ensure all required properties of amqp.MessageProperties are present
      const properties: amqp.MessageProperties = {
        headers: { 'x-custom': 'value' },
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        deliveryMode: undefined,
        priority: undefined,
        correlationId: undefined,
        replyTo: undefined,
        expiration: undefined,
        messageId: undefined,
        timestamp: undefined,
        type: undefined,
        userId: undefined,
        appId: undefined,
        clusterId: undefined, // Added missing property
      };
      const message = service.createMessage(properties, undefined);
      expect(message).toEqual({
        properties: properties,
        body: undefined,
      });
    });
  });

  describe('publishMessage', () => {
    const queueName = 'test-queue';
    const messageBody = { key: 'value' };
    const publishOptions: amqp.Options.Publish = { persistent: true };

    it('should call sendMessage on rabbitMQClient with correct parameters', async () => {
      await service.publishMessage(queueName, messageBody, publishOptions);
      expect(mockRabbitMQClient.sendMessage).toHaveBeenCalledTimes(1);
      const expectedMessage: Message<typeof messageBody> = {
        properties: { headers: {} },
        body: messageBody,
      };
      expect(mockRabbitMQClient.sendMessage).toHaveBeenCalledWith(queueName, expectedMessage, publishOptions);
      expect(mockLogger.info).toHaveBeenCalledWith(`Message published to ${queueName}`);
    });

    it('should handle errors during message publishing', async () => {
      const mockError = new Error('Publish failed');
      mockRabbitMQClient.sendMessage.mockRejectedValueOnce(mockError);

      await expect(service.publishMessage(queueName, messageBody)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith(`Error publishing message to queue ${queueName}:`, mockError);
    });
  });

  describe('updateAndSendMessage', () => {
    const queueName = 'update-queue';
    // Correctly mock amqp.ConsumeMessage with all required fields
    const previousMessage: amqp.ConsumeMessage = {
      content: Buffer.from('old data'),
      fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' },
      properties: {
        headers: { original: 'true' },
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        deliveryMode: undefined,
        priority: undefined,
        correlationId: undefined,
        replyTo: undefined,
        expiration: undefined,
        messageId: undefined,
        timestamp: undefined,
        type: undefined,
        userId: undefined,
        appId: undefined,
        clusterId: undefined, // Added missing property
      } as amqp.MessageProperties,
    } as amqp.ConsumeMessage;
    const currentData = { updated: 'data' };

    it('should update message body and send it', async () => {
      await service.updateAndSendMessage(previousMessage, currentData, queueName);
      expect(mockRabbitMQClient.sendMessage).toHaveBeenCalledTimes(1);
      const expectedMessage: Message<typeof currentData> = {
        properties: previousMessage.properties,
        body: currentData,
      };
      expect(mockRabbitMQClient.sendMessage).toHaveBeenCalledWith(queueName, expectedMessage, { persistentMessage: true });
      expect(mockLogger.info).toHaveBeenCalledWith(`Message published to ${queueName}`);
    });

    it('should throw error if previousMessage is null', async () => {
      await expect(service.updateAndSendMessage(null as any, currentData, queueName)).rejects.toThrow(
        'Previous message is required for updateAndSendMessage and cannot be null or undefined.'
      );
      expect(mockRabbitMQClient.sendMessage).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle errors during update and send', async () => {
      const mockError = new Error('Update and send failed');
      mockRabbitMQClient.sendMessage.mockRejectedValueOnce(mockError);

      await expect(service.updateAndSendMessage(previousMessage, currentData, queueName)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith(`Error in updateAndSendMessage to queue ${queueName}:`, mockError);
    });
  });

  describe('closeConnection', () => {
    it('should call close on rabbitMQClient', async () => {
      await service.closeConnection();
      expect(mockRabbitMQClient.close).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during connection close', async () => {
      const mockError = new Error('Close failed');
      mockRabbitMQClient.close.mockRejectedValueOnce(mockError);

      await expect(service.closeConnection()).rejects.toThrow(mockError);
    });
  });
});

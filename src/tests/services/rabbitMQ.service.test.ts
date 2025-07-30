
// src/tests/services/rabbitMQ.service.test.ts
import RabbitMQClientService from '../../services/rabbitMQ.service';
import { ILogger } from '../../interface/logger.interface';
import * as amqp from 'amqplib';
import winston from 'winston';

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

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

describe('RabbitMQClientService', () => {
  let service: RabbitMQClientService;
  const connectionUrl = 'amqp://localhost';
  const mockChannel = {
    sendToQueue: jest.fn(),
    consume: jest.fn(),
    ack: jest.fn(),
    nack: jest.fn(),
    assertQueue: jest.fn(),
    assertExchange: jest.fn(),
    bindQueue: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
  };
  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
    close: jest.fn(),
    on: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    service = new RabbitMQClientService({
      connectionUrl,
      reconnectRetries: 1,
      reconnectDelayMs: 10,
      channelRecreateRetries: 1,
      channelRecreateDelayMs: 10,
    }, mockLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init', () => {
    it('should connect and create channel', async () => {
      await service.init();
      expect(amqp.connect).toHaveBeenCalledWith(connectionUrl, { heartbeat: 60 });
      expect(mockConnection.createChannel).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('RabbitMQ Client initialized successfully');
    });

    it('should handle connection error during init', async () => {
      const mockError = new Error('Connection failed');
      (amqp.connect as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(service.init()).rejects.toThrow(`Failed to initialize RabbitMQ Client: Failed to establish RabbitMQ connection: ${mockError.message}`);
      // The error is logged twice, once from #handleConnectionError and once from init's catch block
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to establish RabbitMQ connection:', mockError);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to initialize RabbitMQ Client:', expect.any(Error));
    });

    it('should handle channel creation error during init', async () => {
      const mockError = new Error('Channel failed');
      mockConnection.createChannel.mockRejectedValueOnce(mockError);

      await expect(service.init()).rejects.toThrow(`Failed to initialize RabbitMQ Client: Failed to create RabbitMQ channel: ${mockError.message}`);
      // The error is logged twice, once from #handleChannelError and once from init's catch block
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to create RabbitMQ channel:', mockError);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to initialize RabbitMQ Client:', expect.any(Error));
    });
  });

  describe('sendMessage', () => {
    const queueName = 'test-queue';
    const message = { data: 'hello' };

    beforeEach(async () => {
      await service.init(); // Ensure connection and channel are initialized
    });

    it('should send a message to the queue', async () => {
      await service.sendMessage(queueName, message);
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true, arguments: {} });
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
      expect(mockLogger.info).toHaveBeenCalledWith(`Message sent to queue: ${queueName} (persistent: true)`);
    });

    it('should send a non-persistent message if specified', async () => {
      await service.sendMessage(queueName, message, { persistentMessage: false });
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(queueName, Buffer.from(JSON.stringify(message)), { persistent: false });
      expect(mockLogger.info).toHaveBeenCalledWith(`Message sent to queue: ${queueName} (persistent: false)`);
    });

    it('should handle error during message sending', async () => {
      const mockError = new Error('Send failed');
      mockChannel.sendToQueue.mockImplementationOnce(() => { throw mockError; });

      await expect(service.sendMessage(queueName, message)).rejects.toThrow(`Failed to send message to queue ${queueName}: ${mockError.message}`);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to send message:', mockError);
    });
  });

  describe('subscribe', () => {
    const queueName = 'subscribe-queue';
    const handler = jest.fn();

    beforeEach(async () => {
      await service.init();
    });

    it('should subscribe to a queue and process messages', async () => {
      const mockMsg = {
        content: Buffer.from(JSON.stringify({ test: 'data' })),
        fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' }, // Added missing fields
        properties: { headers: {} },
      } as amqp.ConsumeMessage;

      mockChannel.consume.mockImplementationOnce((q, cb) => {
        cb(mockMsg);
      });

      await service.subscribe(queueName, handler);

      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true, arguments: {} }); // Added arguments: {}
      expect(mockChannel.consume).toHaveBeenCalledWith(queueName, expect.any(Function), { noAck: false });
      expect(handler).toHaveBeenCalledWith(mockMsg, { test: 'data' });
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
      expect(mockLogger.info).toHaveBeenCalledWith(`Subscribed to queue: ${queueName}`);
    });

    it('should nack message if handler throws an error', async () => {
      const mockMsg = {
        content: Buffer.from(JSON.stringify({ test: 'data' })),
        fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' }, // Added missing fields
        properties: { headers: {} },
      } as amqp.ConsumeMessage;
      const handlerError = new Error('Handler error');
      handler.mockImplementationOnce(() => { throw handlerError; });

      mockChannel.consume.mockImplementationOnce((q, cb) => {
        cb(mockMsg);
      });

      await service.subscribe(queueName, handler);

      expect(mockLogger.error).toHaveBeenCalledWith('Error processing message:', handlerError, { messageContent: mockMsg.content.toString() });
      expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg, false, true); // Corrected nack arguments: allUpTo, requeue
    });

    it('should nack message if condition is not met', async () => {
      const mockMsg = {
        content: Buffer.from(JSON.stringify({ value: 1 })),
        fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' }, // Added missing fields
        properties: { headers: {} },
      } as amqp.ConsumeMessage;
      // Corrected type for condition function
      const condition = (data: { value: number } | null) => data !== null && data.value > 10;

      mockChannel.consume.mockImplementationOnce((q, cb) => {
        cb(mockMsg);
      });

      await service.subscribe(queueName, handler, {}, condition);

      expect(handler).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Message did not match the condition, requeueing.');
      expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg, false, true); // Corrected nack arguments: allUpTo, requeue
    });
  });

  describe('ack', () => {
    it('should acknowledge a message', async () => {
      await service.init();
      const mockMsg = { fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' } } as amqp.ConsumeMessage; // Added missing fields
      service.ack(mockMsg);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
      expect(mockLogger.info).toHaveBeenCalledWith('Message acknowledged.');
    });

    it('should warn if message is null', async () => {
      await service.init();
      service.ack(null);
      expect(mockLogger.warn).toHaveBeenCalledWith('Attempted to ack a null message or with no channel.');
    });
  });

  describe('nack', () => {
    it('should negative acknowledge a message', async () => {
      await service.init();
      const mockMsg = { fields: { deliveryTag: 1, redelivered: false, exchange: '', routingKey: '', consumerTag: '' } } as amqp.ConsumeMessage; // Added missing fields
      service.nack(mockMsg, true, false);
      expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg, false, true); // Corrected nack arguments: allUpTo, requeue
      expect(mockLogger.info).toHaveBeenCalledWith('Message nacked (requeue: true).');
    });

    it('should warn if message is null', async () => {
      await service.init();
      service.nack(null, true, false);
      expect(mockLogger.warn).toHaveBeenCalledWith('Attempted to nack a null message or with no channel.');
    });
  });

  describe('ensureQueue', () => {
    beforeEach(async () => {
      await service.init();
    });

    it('should assert a durable queue by default', async () => {
      const queueName = 'durable-queue';
      await service.ensureQueue(queueName);
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true, arguments: {} });
      expect(mockLogger.info).toHaveBeenCalledWith(`Queue ensured: ${queueName} (durable: true)`);
    });

    it('should assert a non-durable queue if specified', async () => {
      const queueName = 'non-durable-queue';
      await service.ensureQueue(queueName, { durable: false });
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: false, arguments: {} });
      expect(mockLogger.info).toHaveBeenCalledWith(`Queue ensured: ${queueName} (durable: false)`);
    });

    it('should configure dead lettering if enabled', async () => {
      const queueName = 'dlq-queue';
      const dlqExchange = 'dlq-exchange';
      const dlqQueue = 'dlq-target-queue';

      await service.ensureQueue(queueName, {
        enableDeadLettering: true,
        deadLetterExchangeName: dlqExchange,
        deadLetterQueueName: dlqQueue,
      });

      expect(mockChannel.assertExchange).toHaveBeenCalledWith(dlqExchange, 'fanout', { durable: true });
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(dlqQueue, { durable: true });
      expect(mockChannel.bindQueue).toHaveBeenCalledWith(dlqQueue, dlqExchange, '');
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': dlqExchange,
          'x-dead-letter-routing-key': dlqQueue,
        },
      });
      expect(mockLogger.info).toHaveBeenCalledWith(`DLQ configured for queue ${queueName} to exchange ${dlqExchange} and queue ${dlqQueue}`);
    });

    it('should warn if dead lettering is enabled but DLQ names are missing', async () => {
      const queueName = 'dlq-missing-names-queue';
      await service.ensureQueue(queueName, { enableDeadLettering: true });
      expect(mockLogger.warn).toHaveBeenCalledWith('Dead lettering enabled but DLQ exchange or queue name missing. Dead lettering will not be properly configured.');
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true, arguments: {} }); // Still asserts queue without DLQ args
    });

    it('should handle error during queue assertion', async () => {
      const queueName = 'error-queue'; // Define queueName here
      const mockError = new Error('Assert queue failed');
      mockChannel.assertQueue.mockRejectedValueOnce(mockError);

      await expect(service.ensureQueue(queueName)).rejects.toThrow(`Failed to ensure queue ${queueName}: ${mockError.message}`);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to ensure queue:', mockError);
    });
  });

  describe('close', () => {
    beforeEach(async () => {
      await service.init();
    });

    it('should close channel and connection', async () => {
      await service.close();
      expect(mockChannel.close).toHaveBeenCalledTimes(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('RabbitMQ connection and channel closed');
    });

    it('should handle error during close', async () => {
      const mockError = new Error('Close error');
      mockConnection.close.mockRejectedValueOnce(mockError);

      await expect(service.close()).rejects.toThrow(`Failed to close RabbitMQ connection or channel: ${mockError.message}`);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to close RabbitMQ connection or channel:', mockError);
    });
  });
});

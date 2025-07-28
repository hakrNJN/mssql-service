//src/service/rabbitMQ.service.ts
import * as amqp from 'amqplib';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';
import { EnsureQueueOptions, IRabbitMQClient, SendMessageOptions } from "../interface/rabbitMQ.interface";
import { MessageCondition, MessageHandler } from "../types/rabbitMq.types";
import { WINSTON_LOGGER } from '../utils/logger';
import { ILogger } from '../interface/logger.interface';

interface RabbitMQClientOptions {
    connectionUrl: string;
    reconnectRetries?: number;
    reconnectDelayMs?: number;
    channelRecreateRetries?: number;
    channelRecreateDelayMs?: number;
    // ... other options like heartbeat interval, etc.
}

/**
 * Class representing the RabbitMQ Client service.
 * Implements the IRabbitMQClient interface.
 */

@injectable() 
class RabbitMQClientService implements IRabbitMQClient {
    #connectionUrl: string;
    #connection: amqp.Connection | null = null;
    #channel: amqp.Channel | null = null;
    #reconnectRetries: number;
    #reconnectDelayMs: number;
    #channelRecreateRetries: number;
    #channelRecreateDelayMs: number;
    private readonly logger: ILogger;

    constructor(
        options: RabbitMQClientOptions,
        @inject(WINSTON_LOGGER) logger: ILogger // Inject Winston Logger
    ) {
        this.#connectionUrl = options.connectionUrl;
        this.#reconnectRetries = options.reconnectRetries ?? 5; // Default retries
        this.#reconnectDelayMs = options.reconnectDelayMs ?? 5000; // Default delay
        this.#channelRecreateRetries = options.channelRecreateRetries ?? 5;
        this.#channelRecreateDelayMs = options.channelRecreateDelayMs ?? 5000;
        this.logger = logger; // Assign injected logger
    }

    /**
     * Initializes the RabbitMQ client by creating a connection and a channel.
     * @throws {Error} If initialization fails.
     */
    async init(): Promise<void> {
        try {
            await this.#createConnection();
            await this.#createChannel();
            this.logger.info('RabbitMQ Client initialized successfully');
        } catch (err: any) {
            this.logger.error('Failed to initialize RabbitMQ Client:', err);
            throw new Error(`Failed to initialize RabbitMQ Client: ${err.message}`);
        }
    }

    /**
     * Private method to establish a RabbitMQ connection.
     * @throws {Error} If connection fails.
     */
    async #createConnection(): Promise<void> {
        try {
            this.#connection = await amqp.connect(this.#connectionUrl, { heartbeat: 60 });
            this.#connection.on('error', (err) => this.#handleConnectionError(err));
            this.#connection.on('close', () =>this.logger.warn('RabbitMQ connection closed.'));
        } catch (err: any) {
            this.logger.error('Failed to establish RabbitMQ connection:', err);
            throw new Error(`Failed to establish RabbitMQ connection: ${err.message}`);
        }
    }

    /**
     * Private method to create a RabbitMQ channel.
     * @throws {Error} If channel creation fails or no connection exists.
     */
    async #createChannel(): Promise<void> {
        try {
            if (!this.#connection) {
                throw new Error('No RabbitMQ connection. Cannot create channel.');
            }
            this.#channel = await this.#connection.createChannel();
            this.#channel.on('error', (err: Error) => this.#handleChannelError(err));
            this.logger.info('RabbitMQ channel created successfully');
        } catch (err: any) {
            this.logger.error('Failed to create RabbitMQ channel:', err);
            throw new Error(`Failed to create RabbitMQ channel: ${err.message}`);
        }
    }

    /**
     * Private method to handle RabbitMQ connection errors and attempt reconnection.
     * @param {Error} err - The connection error.
     */
    async #handleConnectionError(err: Error): Promise<void> {
        this.logger.error('A connection error occurred:', err);
        await this.#attemptReconnect();
    }

    /**
     * Private method to handle RabbitMQ channel errors and attempt channel recreation.
     * @param {Error} err - The channel error.
     */
    async #handleChannelError(err: Error): Promise<void> {
        this.logger.error('A channel error occurred:', err);
        await this.#attemptRecreateChannel();
    }

    /**
     * Private method to attempt reconnection to RabbitMQ.
     * @throws {Error} If reconnection fails after maximum attempts.
     */
    async #attemptReconnect(): Promise<void> {
        for (let attempt = 1; attempt <= this.#reconnectRetries; attempt++) {
            try {
                this.logger.info(`Attempting to reconnect (Attempt ${attempt}/${this.#reconnectRetries})...`);
                if (this.#channel) await this.#channel.close();
                if (this.#connection) await this.#connection.close();
                await this.init();
                this.logger.info('Reconnection successful');
                return;
            } catch (err: any) {
                this.logger.error(`Reconnection attempt ${attempt} failed:`, err);
                if (attempt < this.#reconnectRetries) {
                    await this.#delay(this.#reconnectDelayMs);
                } else {
                    throw new Error('Failed to reconnect after maximum attempts');
                }
            }
        }
    }

    /**
     * Private method to attempt recreation of a RabbitMQ channel.
     * @throws {Error} If channel recreation fails after maximum attempts.
     */
    async #attemptRecreateChannel(): Promise<void> {
        for (let attempt = 1; attempt <= this.#reconnectRetries; attempt++) {
            try {
                this.logger.info(`Attempting to recreate channel (Attempt ${attempt}/${this.#reconnectRetries})...`);
                if (this.#channel) await this.#channel.close();
                await this.#createChannel();
                this.logger.info('Channel recreated successfully');
                return;
            } catch (err: any) {
                this.logger.error(`Channel recreation attempt ${attempt} failed:`, err);
                if (attempt < this.#reconnectRetries) {
                    await this.#delay(this.#reconnectDelayMs);
                } else {
                    throw new Error('Failed to recreate channel after maximum attempts');
                }
            }
        }
    }

    /**
     * Private helper method to introduce a delay using Promises.
     * @param {number} ms - Delay in milliseconds.
     * @returns {Promise<void>}
     */
    async #delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Sends a message to a specified RabbitMQ queue.
     * @param {string} queueName - The name of the queue to send the message to.
     * @param {any} message - The message to send. Can be a string, object, or Buffer.
     * @param {SendMessageOptions} [options] - Send message options, including queue assertion and persistence.
     * @throws {Error} If sending the message fails.
     */
    async sendMessage<T>(queueName: string, message: T, options: SendMessageOptions = {}): Promise<void> { // Generic type for message
        try {
            const queueOptions: EnsureQueueOptions = { durable: true };
            await this.ensureQueue(queueName, queueOptions);
            const bufferMessage = this.#prepareMessage(message);
            if (!this.#channel) {
                throw new Error('RabbitMQ channel is not initialized.');
            }
            this.#channel.sendToQueue(queueName, bufferMessage, { persistent: options.persistentMessage === undefined ? true : options.persistentMessage });
            this.logger.info(`Message sent to queue: ${queueName} (persistent: ${options.persistentMessage !== false})`);
        } catch (err: any) {
            this.logger.error('Failed to send message:', err);
            throw new Error(`Failed to send message to queue ${queueName}: ${err.message}`);
        }
    }

    /**
     * Private helper method to prepare a message as a Buffer for sending to RabbitMQ.
     * @param {any} message - The message to prepare.
     * @returns {Buffer} The message as a Buffer.
     */
    #prepareMessage(message: any): Buffer {
        if (Buffer.isBuffer(message)) return message;
        if (typeof message === 'object') return Buffer.from(JSON.stringify(message));
        return Buffer.from(String(message));
    }

    /**
     * Subscribes to a RabbitMQ queue and processes messages with the provided handler.
     * @param {string} queueName - The name of the queue to subscribe to.
     * @param {MessageHandler} handler - The message handler function.
     * @param {EnsureQueueOptions} [options] - Queue options.
     * @param {MessageCondition} [condition] - Optional condition function to filter messages.
     * @throws {Error} If subscribing to the queue fails.
     */
    async subscribe<T>(queueName: string, handler: MessageHandler<T>, options: EnsureQueueOptions = { durable: true }, condition?: MessageCondition<T>): Promise<void> { // Generic handler and condition
        try {
            await this.ensureQueue(queueName, options);
            if (!this.#channel) {
                throw new Error('RabbitMQ channel is not initialized.');
            }

            this.#channel.consume(queueName, async (msg) => {
                if (msg === null) {
                   this.logger.warn('Consumer cancelled by server or channel closed.');
                    return;
                }
                try {
                    const messageData: T = JSON.parse(msg.content.toString()); // Type assertion here
                    if (!condition || condition(messageData)) {
                        await handler(msg, messageData); // Pass messageData to handler
                        this.ack(msg);
                    }
                    else {
                        this.logger.info('Message did not match the condition, requeueing.');
                        this.nack(msg, false, true);
                    }
                } catch (err: any) {
                    this.logger.error('Error processing message:', err, { messageContent: msg.content.toString() }); // Log message content on error
                    this.nack(msg, false, true);
                }
            }, { noAck: false });
            this.logger.info(`Subscribed to queue: ${queueName}`);
        } catch (err: any) {
            this.logger.error('Failed to subscribe to queue:', err);
            throw new Error(`Failed to subscribe to queue ${queueName}: ${err.message}`);
        }
    }

    /**
     * Acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to acknowledge.
     */
    ack(msg: amqp.ConsumeMessage | null): void {
        if (!msg || !this.#channel) {
           this.logger.warn('Attempted to ack a null message or with no channel.');
            return;
        }
        this.#channel.ack(msg); // Correctly using channel.ack with the message object
        this.logger.info('Message acknowledged.'); // Added log for acknowledgement
    }

    /**
     * Negative acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to nack.
     * @param {boolean} requeue - Whether to requeue the message.
     * @param {boolean} allUpTo - Whether to nack all messages up to this one (not typically used as false is usually preferred).
     */
    nack(msg: amqp.ConsumeMessage | null, requeue: boolean, allUpTo: boolean = false): void {
        if (!msg || !this.#channel) {
           this.logger.warn('Attempted to nack a null message or with no channel.');
            return;
        }
        this.#channel.nack(msg, allUpTo, requeue); // Correctly using channel.nack with message object and parameters
        this.logger.info(`Message nacked (requeue: ${requeue}).`); // Added log for nack
    }

    /**
     * Ensures that a RabbitMQ queue exists. Creates the queue if it does not exist.
     * @param {string} queueName - The name of the queue to ensure.
     * @param {EnsureQueueOptions} [options] - Queue options, including durability and DLQ settings.
     * @throws {Error} If ensuring the queue fails.
     */
    async ensureQueue(queueName: string, options: EnsureQueueOptions = { durable: true }): Promise<void> { // Default to durable queues
        try {
            if (!this.#channel) await this.#createChannel();
            if (!this.#channel) { // Double check after attempting to create channel
                throw new Error('RabbitMQ channel is not initialized after creation attempt.');
            }

            let assertOptions: amqp.Options.AssertQueue = { durable: options.durable === undefined ? true : options.durable, arguments: {} }; // Default durable if not specified

            if (options.enableDeadLettering) {
                if (!options.deadLetterExchangeName || !options.deadLetterQueueName) {
                   this.logger.warn('Dead lettering enabled but DLQ exchange or queue name missing. Dead lettering will not be properly configured.');
                } else {
                    await this.#assertDeadLetterExchangeAndQueue(options.deadLetterExchangeName, options.deadLetterQueueName);
                    assertOptions.arguments!['x-dead-letter-exchange'] = options.deadLetterExchangeName;
                    assertOptions.arguments!['x-dead-letter-routing-key'] = options.deadLetterQueueName; // Route to queue name as routing key for simplicity
                    this.logger.info(`DLQ configured for queue ${queueName} to exchange ${options.deadLetterExchangeName} and queue ${options.deadLetterQueueName}`);
                }
            }

            await this.#channel.assertQueue(queueName, assertOptions);
            this.logger.info(`Queue ensured: ${queueName} (durable: ${assertOptions.durable})`);
        } catch (err: any) {
            this.logger.error('Failed to ensure queue:', err);
            throw new Error(`Failed to ensure queue ${queueName}: ${err.message}`);
        }
    }

    async #assertDeadLetterExchangeAndQueue(exchangeName: string, queueName: string): Promise<void> {
        if (!this.#channel) throw new Error('Channel is not initialized');
        await this.#channel.assertExchange(exchangeName, 'fanout', { durable: true }); // Fanout exchange for DLQ is common
        await this.#channel.assertQueue(queueName, { durable: true });
        await this.#channel.bindQueue(queueName, exchangeName, ''); // Bind DLQ to DLQ exchange
        this.logger.info(`DLQ Exchange and Queue ensured: Exchange=${exchangeName}, Queue=${queueName}`);
    }


    /**
     * Closes the RabbitMQ channel and connection.
     * @throws {Error} If closing connection or channel fails.
     */
    async close(): Promise<void> {
        try {
            if (this.#channel) await this.#channel.close();
            if (this.#connection) await this.#connection.close();
            this.logger.info('RabbitMQ connection and channel closed');
        } catch (err: any) {
            this.logger.error('Failed to close RabbitMQ connection or channel:', err);
            throw new Error(`Failed to close RabbitMQ connection or channel: ${err.message}`);
        } finally {
            this.#channel = null;
            this.#connection = null;
        }
    }
}

export default RabbitMQClientService;



//--------------------------------
//  uses
//--------------------------------
// import RabbitMQClientService from './rabbitmq-client.service'; // Adjust path as needed

// async function main() {
//   const rabbitMQClient = new RabbitMQClientService('amqp://localhost'); // Replace with your connection URL

//   try {
//     await rabbitMQClient.init();

//     const queueName = 'my_queue';
//     await rabbitMQClient.ensureQueue(queueName);

//     // Send a message
//     await rabbitMQClient.sendMessage(queueName, { message: 'Hello RabbitMQ!' });

//     // Subscribe to the queue
//     await rabbitMQClient.subscribe(queueName, async (msg) => {
//       if (msg) {
//         const content = msg.content.toString();
//         this.logger.info(`Received message: ${content}`);
//         // Process your message here
//       }
//     });

//     this.logger.info('Listening for messages...');

//     // Keep the process running to receive messages
//     // To close the connection later: await rabbitMQClient.close();

//   } catch (error: any) {
//     this.logger.error('An error occurred:', error.message);
//   }
// }

// main();
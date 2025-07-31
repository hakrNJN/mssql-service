import * as amqp from 'amqplib';
import { EnsureQueueOptions, IRabbitMQClient, SendMessageOptions } from "../interface/rabbitMQ.interface";
import { MessageCondition, MessageHandler } from "../types/rabbitMq.types";
import { ILogger } from '../interface/logger.interface';
interface RabbitMQClientOptions {
    connectionUrl: string;
    reconnectRetries?: number;
    reconnectDelayMs?: number;
    channelRecreateRetries?: number;
    channelRecreateDelayMs?: number;
}
/**
 * Class representing the RabbitMQ Client service.
 * Implements the IRabbitMQClient interface.
 */
declare class RabbitMQClientService implements IRabbitMQClient {
    #private;
    private readonly logger;
    constructor(options: RabbitMQClientOptions, logger: ILogger);
    /**
     * Initializes the RabbitMQ client by creating a connection and a channel.
     * @throws {Error} If initialization fails.
     */
    init(): Promise<void>;
    /**
     * Sends a message to a specified RabbitMQ queue.
     * @param {string} queueName - The name of the queue to send the message to.
     * @param {any} message - The message to send. Can be a string, object, or Buffer.
     * @param {SendMessageOptions} [options] - Send message options, including queue assertion and persistence.
     * @throws {Error} If sending the message fails.
     */
    sendMessage<T>(queueName: string, message: T, options?: SendMessageOptions): Promise<void>;
    /**
     * Subscribes to a RabbitMQ queue and processes messages with the provided handler.
     * @param {string} queueName - The name of the queue to subscribe to.
     * @param {MessageHandler} handler - The message handler function.
     * @param {EnsureQueueOptions} [options] - Queue options.
     * @param {MessageCondition} [condition] - Optional condition function to filter messages.
     * @throws {Error} If subscribing to the queue fails.
     */
    subscribe<T>(queueName: string, handler: MessageHandler<T>, options?: EnsureQueueOptions, condition?: MessageCondition<T>): Promise<void>;
    /**
     * Acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to acknowledge.
     */
    ack(msg: amqp.ConsumeMessage | null): void;
    /**
     * Negative acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to nack.
     * @param {boolean} requeue - Whether to requeue the message.
     * @param {boolean} allUpTo - Whether to nack all messages up to this one (not typically used as false is usually preferred).
     */
    nack(msg: amqp.ConsumeMessage | null, requeue: boolean, allUpTo?: boolean): void;
    /**
     * Ensures that a RabbitMQ queue exists. Creates the queue if it does not exist.
     * @param {string} queueName - The name of the queue to ensure.
     * @param {EnsureQueueOptions} [options] - Queue options, including durability and DLQ settings.
     * @throws {Error} If ensuring the queue fails.
     */
    ensureQueue(queueName: string, options?: EnsureQueueOptions): Promise<void>;
    /**
     * Closes the RabbitMQ channel and connection.
     * @throws {Error} If closing connection or channel fails.
     */
    close(): Promise<void>;
}
export default RabbitMQClientService;

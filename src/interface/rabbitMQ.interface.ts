import * as amqp from 'amqplib';
import { MessageCondition, MessageHandler } from '../types/rabbitMq.types';
/**
 * Interface for RabbitMQ Client service.
 */
export interface IRabbitMQClient {
    init(): Promise<void>;
    sendMessage(queueName: string, message: any, options?: amqp.Options.AssertQueue): Promise<void>;
    subscribe(queueName: string, handler: MessageHandler, options?: amqp.Options.AssertQueue, condition?: MessageCondition): Promise<void>;
    ensureQueue(queueName: string, options?: amqp.Options.AssertQueue): Promise<void>;
    close(): Promise<void>;
  }
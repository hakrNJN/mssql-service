//src/interfaces/rabbitMQ.interface.ts
import * as amqp from 'amqplib';
import { MessageCondition, MessageHandler } from '../types/rabbitMq.types';

export interface EnsureQueueOptions extends amqp.Options.AssertQueue {
    enableDeadLettering?: boolean;
    deadLetterExchangeName?: string; // Consider making this conditionally required
    deadLetterQueueName?: string;    // Consider making this conditionally required
}

export interface SendMessageOptions extends amqp.Options.Publish {
    persistentMessage?: boolean;
}

export interface IRabbitMQClient {
  init(): Promise<void>;
  sendMessage(queueName: string, message: any, options?: SendMessageOptions): Promise<void>;
  subscribe(queueName: string, handler: MessageHandler, options?: EnsureQueueOptions, condition?: MessageCondition): Promise<void>;
  ensureQueue(queueName: string, options?: EnsureQueueOptions): Promise<void>;
  close(): Promise<void>;
  ack(msg: amqp.ConsumeMessage | null): void;
  nack(msg: amqp.ConsumeMessage | null, requeue: boolean, allUpTo?: boolean): void;
}

// More strictly typed EnsureQueueOptions for DLQ
export type StrictEnsureQueueOptions =
  | EnsureQueueOptions & { enableDeadLettering?: false }
  | (EnsureQueueOptions & {
      enableDeadLettering: true;
      deadLetterExchangeName: string;
      deadLetterQueueName: string;
    });

export type AdvancedEnsureQueueOptions = EnsureQueueOptions | StrictEnsureQueueOptions; // Use this in service if you want strict type checking
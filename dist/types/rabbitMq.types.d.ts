import * as amqp from 'amqplib';
export type MessageHandler<T = any> = (msg: amqp.ConsumeMessage | null, messageData?: T) => Promise<void>;
export type MessageCondition<T = any> = (messageData: T | null) => boolean;

import * as amqp from 'amqplib';
export type MessageHandler = (msg: amqp.ConsumeMessage | null) => Promise<void>;
export type MessageCondition = (messageData: any | null) => boolean;
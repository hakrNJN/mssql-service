import { ILogger } from '../interface/logger.interface';
import { MessageHandler } from '../types/rabbitMq.types';
export declare class NoOpRabbitMQClientService {
    private readonly logger;
    constructor(logger: ILogger);
    init(): Promise<void>;
    ensureQueue(queueName: string, options?: any): Promise<void>;
    publish(exchange: string, routingKey: string, content: Buffer, options?: any): Promise<void>;
    subscribe<T>(queueName: string, handler: MessageHandler<T>, options?: any): Promise<void>;
    ack(message: any): void;
    nack(message: any, allUpTo?: boolean, requeue?: boolean): void;
    close(): Promise<void>;
}

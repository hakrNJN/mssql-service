import { injectable } from 'tsyringe';
import { ILogger } from '../interface/logger.interface';
import { MessageHandler } from '../types/rabbitMq.types';
import { WINSTON_LOGGER } from '../utils/logger';
import { inject } from 'tsyringe';

@injectable()
export class NoOpRabbitMQClientService {
    private readonly logger: ILogger;

    constructor(@inject(WINSTON_LOGGER) logger: ILogger) {
        this.logger = logger;
        this.logger.info("RabbitMQ is disabled. Using No-Op RabbitMQ Client Service.");
    }

    async init(): Promise<void> {
        this.logger.info("No-Op RabbitMQ Client Service: init called (RabbitMQ is disabled).");
    }

    async ensureQueue(queueName: string, options?: any): Promise<void> {
        this.logger.info(`No-Op RabbitMQ Client Service: ensureQueue called for ${queueName} (RabbitMQ is disabled).`);
    }

    async publish(exchange: string, routingKey: string, content: Buffer, options?: any): Promise<void> {
        this.logger.info(`No-Op RabbitMQ Client Service: publish called to ${exchange}/${routingKey} (RabbitMQ is disabled).`);
    }

    async subscribe<T>(queueName: string, handler: MessageHandler<T>, options?: any): Promise<void> {
        this.logger.info(`No-Op RabbitMQ Client Service: subscribe called for ${queueName} (RabbitMQ is disabled).`);
    }

    ack(message: any): void {
        this.logger.info("No-Op RabbitMQ Client Service: ack called (RabbitMQ is disabled).");
    }

    nack(message: any, allUpTo?: boolean, requeue?: boolean): void {
        this.logger.info("No-Op RabbitMQ Client Service: nack called (RabbitMQ is disabled).");
    }

    async close(): Promise<void> {
        this.logger.info("No-Op RabbitMQ Client Service: close called (RabbitMQ is disabled).");
    }
}

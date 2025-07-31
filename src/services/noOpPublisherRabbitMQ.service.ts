import { injectable } from 'tsyringe';
import { ILogger } from '../interface/logger.interface';
import { WINSTON_LOGGER } from '../utils/logger';
import { inject } from 'tsyringe';

@injectable()
export class NoOpPublisherRabbitMQService {
    private readonly logger: ILogger;

    constructor(@inject(WINSTON_LOGGER) logger: ILogger) {
        this.logger = logger;
        this.logger.info("RabbitMQ is disabled. Using No-Op Publisher RabbitMQ Service.");
    }

    async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
        this.logger.info(`No-Op Publisher RabbitMQ Service: publishMessage called to ${exchange}/${routingKey} (RabbitMQ is disabled).`);
    }

    async updateAndSendMessage(originalMsg: any, updatedContent: any, targetQueue: string): Promise<void> {
        this.logger.info(`No-Op Publisher RabbitMQ Service: updateAndSendMessage called for ${targetQueue} (RabbitMQ is disabled).`);
    }

    async closeConnection(): Promise<void> {
        this.logger.info("No-Op Publisher RabbitMQ Service: closeConnection called (RabbitMQ is disabled).");
    }
}

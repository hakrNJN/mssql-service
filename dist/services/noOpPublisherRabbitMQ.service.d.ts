import { ILogger } from '../interface/logger.interface';
export declare class NoOpPublisherRabbitMQService {
    private readonly logger;
    constructor(logger: ILogger);
    publishMessage(exchange: string, routingKey: string, message: any): Promise<void>;
    updateAndSendMessage(originalMsg: any, updatedContent: any, targetQueue: string): Promise<void>;
    closeConnection(): Promise<void>;
}

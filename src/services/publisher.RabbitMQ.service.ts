// src/service/publisher.rabbitMQ.service.ts
import * as amqp from 'amqplib';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';
import { Message, MessageProperties } from '../types/message.types';
import { WINSTON_LOGGER } from '../utils/logger';
import RabbitMQClientService from './rabbitMQ.service'; // Adjust path if necessary
import { ILogger } from '../interface/logger.interface';

@injectable()
class PublisherRabbitMQService {
    private readonly logger: ILogger;

    constructor(@inject(RabbitMQClientService) private rabbitMQClient: RabbitMQClientService,
        @inject(WINSTON_LOGGER) logger: ILogger) { 
        this.logger = logger
     }

    // Modified createMessage to be generic and type-safe
    createMessage<BodyType>(properties?: MessageProperties, body?: BodyType): Message<BodyType> {
        const message: Message<BodyType> = {
            properties: properties || { headers: {} }, // Default properties
            body: body as BodyType // body is now optional and can be undefined
        };
        return message;
    }

    async publishMessage<BodyType>(queueName: string, messageBody: BodyType, options?: amqp.Options.Publish): Promise<void> {
        try {
            const message = this.createMessage<BodyType>(undefined, messageBody); // Create with default properties
            await this.rabbitMQClient.sendMessage(queueName, message, options);
            this.logger.info(`Message published to ${queueName}`);
        } catch (error: any) {
            this.logger.error(`Error publishing message to queue ${queueName}:`, error);
            throw error;
        }
    }

    async updateAndSendMessage<BodyType>(previousMessage: amqp.ConsumeMessage, currentData: BodyType, queueName: string): Promise<void> {
        try {
            if (!previousMessage) {
                throw new Error('Previous message is required for updateAndSendMessage and cannot be null or undefined.');
            }
            const message = this.createMessage<BodyType>(previousMessage.properties) // Now createMessage expects non-nullable previousMessage

            //Enhance the message body with currentData
            message.body = currentData;

            await this.rabbitMQClient.sendMessage(queueName, message, { persistentMessage: true }); // Ensure persistence
            this.logger.info(`Message published to ${queueName}`);
        } catch (error: any) {
            this.logger.error(`Error in updateAndSendMessage to queue ${queueName}:`, error);
            throw error; // Re-throw to be handled by the controller
        }
    }


    async closeConnection(): Promise<void> {
        await this.rabbitMQClient.close();
    }
}

export default PublisherRabbitMQService;
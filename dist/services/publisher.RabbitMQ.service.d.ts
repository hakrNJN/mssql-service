import * as amqp from 'amqplib';
import { Message, MessageProperties } from '../types/message.types';
import RabbitMQClientService from './rabbitMQ.service';
import { ILogger } from '../interface/logger.interface';
declare class PublisherRabbitMQService {
    private rabbitMQClient;
    private readonly logger;
    constructor(rabbitMQClient: RabbitMQClientService, logger: ILogger);
    createMessage<BodyType>(properties?: MessageProperties, body?: BodyType): Message<BodyType>;
    publishMessage<BodyType>(queueName: string, messageBody: BodyType, options?: amqp.Options.Publish): Promise<void>;
    updateAndSendMessage<BodyType>(previousMessage: amqp.ConsumeMessage, currentData: BodyType, queueName: string): Promise<void>;
    closeConnection(): Promise<void>;
}
export default PublisherRabbitMQService;

// src/controller/eventDriven.controller.ts
import { inject, injectable } from 'tsyringe';
import { ILogger } from '../interface/logger.interface';
import FeaturesService from '../services/feature.service';
import PublisherRabbitMQService from '../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../services/rabbitMQ.service';
import { MessageHandler } from '../types/rabbitMq.types';
import { WINSTON_LOGGER } from '../utils/logger';
import { PUBLISHER_RABBITMQ_SERVICE, RABBITMQ_CLIENT_SERVICE } from '../utils/registerDependencies';

// Define message types for queues (example)
interface FetchDataMessagePayload {
    id: string;
}

interface FetchRegisterMessagePayload {
    registerId: string;
}

// Define queue names as constants



// const featuresService = new FeaturesService( '../config');

@injectable()
class EventDrivenController {
    private rabbitMQClient: RabbitMQClientService;
    private publisherService: PublisherRabbitMQService;
    // private featuresService: FeatureConfig = {};
    private featuresService: FeaturesService;
    private readonly logger: ILogger;

    constructor(
        @inject(RABBITMQ_CLIENT_SERVICE) rabbitMQClient: RabbitMQClientService,
        @inject(PUBLISHER_RABBITMQ_SERVICE) publisherService: PublisherRabbitMQService,
        @inject(FeaturesService) featuresService: FeaturesService,// Inject FeaturesService
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.rabbitMQClient = rabbitMQClient;
        this.publisherService = publisherService;
        this.featuresService = featuresService; // Assign injected service
        this.logger = logger;
    }

    async initialize(): Promise<void> {
        if (!this.featuresService.isFeatureEnabled('enableRabbitMQ')) {
            this.logger.info('RabbitMQ is disabled. EventDrivenController initialization skipped.');
            return;
        }
        await this.rabbitMQClient.init();
        await this.featuresService.initialize();
        // featuresService.loadFeatures().then(() => {
        //     this.featuresService = featuresService.getFeatures()
        //  })
    }

    async startEventListeners(): Promise<void> { // New method to start listeners
        if (!this.featuresService.isFeatureEnabled('enableRabbitMQ')) {
            this.logger.info('RabbitMQ is disabled. EventDrivenController listeners not started.');
            return;
        }
        if (this.featuresService.isFeatureEnabled('fetchDataEnabled')) {
            await this.fetchData();
        } else {
            this.logger.info('FetchData feature is not enabled, skipping fetchData listener.');
        }

        if (this.featuresService.isFeatureEnabled('fetchRegisterEnabled')) {
            await this.fetchRegister();
        } else {
            this.logger.info('fetchRegister feature is not enabled, skipping fetchRegister listener.');
        }
        this.logger.info('Event listeners started based on feature flags.');
    }

    private async fetchData() { // always running

        // if (this.featuresService.isFeatureEnabled('fetchDataEnabled')) {
        this.logger.info('FetchData feature is enabled');

        // const messageHandler: MessageHandler<FetchDataMessagePayload> = async (msg: amqp.ConsumeMessage | null) => {
        const messageHandler: MessageHandler<FetchDataMessagePayload> = async (msg, messagePayload) => { // Type-safe handler
            if (msg && messagePayload) { // Ensure messagePayload is also checked
                try {
                    // const messageContent = JSON.parse(msg.content.toString());
                    // const id = messageContent.id; // Assuming message has an 'id' property
                    const { id } = messagePayload;
                    if (!id) {
                        this.logger.warn('Message received without ID, NACKing message.', messagePayload);
                        this.rabbitMQClient.nack(msg, false, false); // Correct: nack on msg object
                        return;
                    }

                    // const saleData = await getInvoiceDataBySalTrnId(id); // Call sale service
                    const saleData = {}

                    if (saleData) {
                        await this.publisherService.updateAndSendMessage(msg, saleData, this.featuresService.getQueueName('validateQueue')!); // Publish to ValidateQueue
                        this.rabbitMQClient.ack(msg); // Ack original message after successful publish
                        this.logger.info(`Processed message with ID: ${id} and sent to ${this.featuresService.getQueueName('validateQueue')}`);
                    } else {
                        this.logger.warn(`No sale data found for ID: ${id}, NACKing and requeueing message.`);
                        this.rabbitMQClient.nack(msg, false, true); // NACK and requeue - transient error, data not found?
                    }

                } catch (error: any) {
                    this.logger.error('Error processing message:', error, { messagePayload });
                    this.rabbitMQClient.nack(msg, false, true); // NACK and requeue on processing error
                }
            } else {
                this.logger.warn('Consumer cancelled by server');
            }
        };

        try {
            await this.rabbitMQClient.ensureQueue(this.featuresService.getQueueName('fetchDataQueue')!, { durable: true }); // Ensure durable queue
            await this.rabbitMQClient.subscribe(this.featuresService.getQueueName('fetchDataQueue')!, messageHandler, { durable: true }); // Subscribe to durable queue
            this.logger.info(`Subscribed to ${this.featuresService.getQueueName('fetchDataQueue')}`);
        } catch (error: any) {
            this.logger.error(`Error setting up fetchData queue or subscription:`, error);
        }

        // } else {
        //     this.logger.info('FetchData feature is not enabled');
        // }
    }


    private async fetchRegister() { // similar structure to fetchData
        // if (this.featuresService.isFeatureEnabled('fetchRegisterEnabled'))  {
        //     this.logger.info('fetchRegister feature is enabled');

        // const messageHandler: MessageHandler = async (msg: amqp.ConsumeMessage | null) => {
        const messageHandler: MessageHandler<FetchRegisterMessagePayload> = async (msg, messagePayload) => { // Type-safe handler
            if (msg && messagePayload) { // Ensure messagePayload is checked
                try {
                    // const messageContent = JSON.parse(msg.content.toString());
                    // const registerId = messageContent.registerId; // Assuming message has 'registerId'
                    const { registerId } = messagePayload;

                    if (!registerId) {
                        this.logger.warn('Register message received without registerId, NACKing message.', messagePayload);
                        this.rabbitMQClient.nack(msg, false, false);
                        return;
                    }

                    // Replace with actual register data fetching logic from your service
                    const registerData = await this.getRegisterDataById(registerId); // Placeholder register data fetch

                    if (registerData) {
                        await this.publisherService.updateAndSendMessage(msg, registerData, this.featuresService.getQueueName('registerValidateQueue')!);
                        this.rabbitMQClient.ack(msg);
                        this.logger.info(`Processed register message with ID: ${registerId} and sent to ${this.featuresService.getQueueName('registerValidateQueue')}`);
                    } else {
                        this.logger.warn(`No register data found for ID: ${registerId}, NACKing and requeueing message.`);
                        this.rabbitMQClient.nack(msg, false, true);
                    }

                } catch (error: any) {
                    this.logger.error('Error processing register message:', error, { messagePayload });
                    this.rabbitMQClient.nack(msg, false, true);
                }
            } else {
                this.logger.warn('Consumer cancelled by server for register queue');
            }
        };

        try {
            await this.rabbitMQClient.ensureQueue(this.featuresService.getQueueName('fetchRegisterQueue')!, { durable: true });
            await this.rabbitMQClient.subscribe(this.featuresService.getQueueName('fetchRegisterQueue')!, messageHandler, { durable: true });
            this.logger.info(`Subscribed to ${this.featuresService.getQueueName('fetchRegisterQueue')}`);
        } catch (error: any) {
            this.logger.error(`Error setting up fetchRegister queue or subscription:`, error);
        }

        // } else {
        //     this.logger.info('fetchRegister feature is not enabled');
        // }
    }

    // Placeholder for register data fetching - replace with your actual service call
    private async getRegisterDataById(id: any): Promise<any> {
        // Replace this with your actual register data retrieval logic
        this.logger.info(`Fetching register data for ID: ${id} (Placeholder)`);
        return { registerId: id, status: 'Processed', details: 'Placeholder register data' };
    }

    async close(): Promise<void> {
        if (!this.featuresService.isFeatureEnabled('enableRabbitMQ')) {
            this.logger.info('RabbitMQ is disabled. Skipping EventDrivenController close.');
            return;
        }
        await this.rabbitMQClient.close();
        await this.publisherService.closeConnection();
        this.logger.info('EventDrivenController closed RabbitMQ connections.');
    }
}

export default EventDrivenController;

// usues

// src/main.ts (or wherever you bootstrap your application)
// import RabbitMQClientService from './service/rabbitMQ.service';
// import PublisherRabbitMQService from './service/publisher.rabbitMQ.service';
// import EventDrivenController from './controller/eventDriven.controller';

// async function main() {
//     const rabbitMQConnectionUrl = 'amqp://localhost'; // Replace with your RabbitMQ connection URL
//     const rabbitMQClient = new RabbitMQClientService(rabbitMQConnectionUrl);
//     const publisherService = new PublisherRabbitMQService(rabbitMQClient);
//     const eventDrivenController = new EventDrivenController(rabbitMQClient, publisherService);

//     try {
//         await eventDrivenController.initialize();
//         await eventDrivenController.fetchData();
//         await eventDrivenController.fetchRegister();

//         this.logger.info('Event Driven Controller is running and listening for messages...');

//         // Keep the application running to listen for messages.
//         // In a real application, you might use a process manager to keep it alive.

//         // To gracefully close the controller and connections when needed:
//         // setTimeout(async () => {
//         //     this.logger.info('Closing Event Driven Controller...');
//         //     await eventDrivenController.close();
//         //     this.logger.info('Event Driven Controller closed.');
//         //     process.exit(0);
//         // }, 60000); // Example: close after 60 seconds

//     } catch (error: any) {
//         this.logger.error('Error starting Event Driven Controller:', error);
//         process.exit(1);
//     }
// }

// main();
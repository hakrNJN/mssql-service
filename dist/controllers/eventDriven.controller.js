"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/controller/eventDriven.controller.ts
const tsyringe_1 = require("tsyringe");
const feature_service_1 = __importDefault(require("../services/feature.service"));
const publisher_RabbitMQ_service_1 = __importDefault(require("../services/publisher.RabbitMQ.service"));
const rabbitMQ_service_1 = __importDefault(require("../services/rabbitMQ.service"));
const logger_1 = require("../utils/logger");
// Define queue names as constants
const fetchDataQueueName = 'FetchDataQueue';
const validateQueueName = 'ValidateQueue';
const fetchRegisterQueueName = 'FetchRegisterQueue';
const registerValidateQueueName = 'RegisterValidateQueue';
// const featuresService = new FeaturesService( '../config');
let EventDrivenController = class EventDrivenController {
    constructor(rabbitMQClient, publisherService, featuresService, logger) {
        this.rabbitMQClient = rabbitMQClient;
        this.publisherService = publisherService;
        this.featuresService = featuresService; // Assign injected service
        this.logger = logger;
    }
    async initialize() {
        await this.rabbitMQClient.init();
        await this.featuresService.initialize();
        // featuresService.loadFeatures().then(() => {
        //     this.featuresService = featuresService.getFeatures()
        //  })
    }
    async startEventListeners() {
        if (this.featuresService.isFeatureEnabled('fetchDataEnabled')) {
            await this.fetchData();
        }
        else {
            this.logger.info('FetchData feature is not enabled, skipping fetchData listener.');
        }
        if (this.featuresService.isFeatureEnabled('fetchRegisterEnabled')) {
            await this.fetchRegister();
        }
        else {
            this.logger.info('fetchRegister feature is not enabled, skipping fetchRegister listener.');
        }
        this.logger.info('Event listeners started based on feature flags.');
    }
    async fetchData() {
        // if (this.featuresService.isFeatureEnabled('fetchDataEnabled')) {
        this.logger.info('FetchData feature is enabled');
        // const messageHandler: MessageHandler<FetchDataMessagePayload> = async (msg: amqp.ConsumeMessage | null) => {
        const messageHandler = async (msg, messagePayload) => {
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
                    const saleData = {};
                    if (saleData) {
                        await this.publisherService.updateAndSendMessage(msg, saleData, validateQueueName); // Publish to ValidateQueue
                        this.rabbitMQClient.ack(msg); // Ack original message after successful publish
                        this.logger.info(`Processed message with ID: ${id} and sent to ${validateQueueName}`);
                    }
                    else {
                        this.logger.warn(`No sale data found for ID: ${id}, NACKing and requeueing message.`);
                        this.rabbitMQClient.nack(msg, false, true); // NACK and requeue - transient error, data not found?
                    }
                }
                catch (error) {
                    this.logger.error('Error processing message:', error, { messagePayload });
                    this.rabbitMQClient.nack(msg, false, true); // NACK and requeue on processing error
                }
            }
            else {
                this.logger.warn('Consumer cancelled by server');
            }
        };
        try {
            await this.rabbitMQClient.ensureQueue(fetchDataQueueName, { durable: true }); // Ensure durable queue
            await this.rabbitMQClient.subscribe(fetchDataQueueName, messageHandler, { durable: true }); // Subscribe to durable queue
            this.logger.info(`Subscribed to ${fetchDataQueueName}`);
        }
        catch (error) {
            this.logger.error(`Error setting up fetchData queue or subscription:`, error);
        }
        // } else {
        //     this.logger.info('FetchData feature is not enabled');
        // }
    }
    async fetchRegister() {
        // if (this.featuresService.isFeatureEnabled('fetchRegisterEnabled'))  {
        //     this.logger.info('fetchRegister feature is enabled');
        // const messageHandler: MessageHandler = async (msg: amqp.ConsumeMessage | null) => {
        const messageHandler = async (msg, messagePayload) => {
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
                        await this.publisherService.updateAndSendMessage(msg, registerData, registerValidateQueueName);
                        this.rabbitMQClient.ack(msg);
                        this.logger.info(`Processed register message with ID: ${registerId} and sent to ${registerValidateQueueName}`);
                    }
                    else {
                        this.logger.warn(`No register data found for ID: ${registerId}, NACKing and requeueing message.`);
                        this.rabbitMQClient.nack(msg, false, true);
                    }
                }
                catch (error) {
                    this.logger.error('Error processing register message:', error, { messagePayload });
                    this.rabbitMQClient.nack(msg, false, true);
                }
            }
            else {
                this.logger.warn('Consumer cancelled by server for register queue');
            }
        };
        try {
            await this.rabbitMQClient.ensureQueue(fetchRegisterQueueName, { durable: true });
            await this.rabbitMQClient.subscribe(fetchRegisterQueueName, messageHandler, { durable: true });
            this.logger.info(`Subscribed to ${fetchRegisterQueueName}`);
        }
        catch (error) {
            this.logger.error(`Error setting up fetchRegister queue or subscription:`, error);
        }
        // } else {
        //     this.logger.info('fetchRegister feature is not enabled');
        // }
    }
    // Placeholder for register data fetching - replace with your actual service call
    async getRegisterDataById(id) {
        // Replace this with your actual register data retrieval logic
        this.logger.info(`Fetching register data for ID: ${id} (Placeholder)`);
        return { registerId: id, status: 'Processed', details: 'Placeholder register data' };
    }
    async close() {
        await this.rabbitMQClient.close();
        await this.publisherService.closeConnection();
        this.logger.info('EventDrivenController closed RabbitMQ connections.');
    }
};
EventDrivenController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(2, (0, tsyringe_1.inject)(feature_service_1.default)),
    __param(3, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [rabbitMQ_service_1.default,
        publisher_RabbitMQ_service_1.default,
        feature_service_1.default, Object])
], EventDrivenController);
exports.default = EventDrivenController;
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

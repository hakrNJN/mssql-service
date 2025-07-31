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
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
const rabbitMQ_service_1 = __importDefault(require("./rabbitMQ.service")); // Adjust path if necessary
let PublisherRabbitMQService = class PublisherRabbitMQService {
    constructor(rabbitMQClient, logger) {
        this.rabbitMQClient = rabbitMQClient;
        this.logger = logger;
    }
    // Modified createMessage to be generic and type-safe
    createMessage(properties, body) {
        const message = {
            properties: properties || { headers: {} }, // Default properties
            body: body // body is now optional and can be undefined
        };
        return message;
    }
    async publishMessage(queueName, messageBody, options) {
        try {
            const message = this.createMessage(undefined, messageBody); // Create with default properties
            await this.rabbitMQClient.sendMessage(queueName, message, options);
            this.logger.info(`Message published to ${queueName}`);
        }
        catch (error) {
            this.logger.error(`Error publishing message to queue ${queueName}:`, error);
            throw error;
        }
    }
    async updateAndSendMessage(previousMessage, currentData, queueName) {
        try {
            if (!previousMessage) {
                throw new Error('Previous message is required for updateAndSendMessage and cannot be null or undefined.');
            }
            const message = this.createMessage(previousMessage.properties); // Now createMessage expects non-nullable previousMessage
            //Enhance the message body with currentData
            message.body = currentData;
            await this.rabbitMQClient.sendMessage(queueName, message, { persistentMessage: true }); // Ensure persistence
            this.logger.info(`Message published to ${queueName}`);
        }
        catch (error) {
            this.logger.error(`Error in updateAndSendMessage to queue ${queueName}:`, error);
            throw error; // Re-throw to be handled by the controller
        }
    }
    async closeConnection() {
        await this.rabbitMQClient.close();
    }
};
PublisherRabbitMQService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(rabbitMQ_service_1.default)),
    __param(1, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [rabbitMQ_service_1.default, Object])
], PublisherRabbitMQService);
exports.default = PublisherRabbitMQService;

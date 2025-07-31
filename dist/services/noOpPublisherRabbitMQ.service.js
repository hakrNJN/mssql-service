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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOpPublisherRabbitMQService = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
const tsyringe_2 = require("tsyringe");
let NoOpPublisherRabbitMQService = class NoOpPublisherRabbitMQService {
    constructor(logger) {
        this.logger = logger;
        this.logger.info("RabbitMQ is disabled. Using No-Op Publisher RabbitMQ Service.");
    }
    async publishMessage(exchange, routingKey, message) {
        this.logger.info(`No-Op Publisher RabbitMQ Service: publishMessage called to ${exchange}/${routingKey} (RabbitMQ is disabled).`);
    }
    async updateAndSendMessage(originalMsg, updatedContent, targetQueue) {
        this.logger.info(`No-Op Publisher RabbitMQ Service: updateAndSendMessage called for ${targetQueue} (RabbitMQ is disabled).`);
    }
    async closeConnection() {
        this.logger.info("No-Op Publisher RabbitMQ Service: closeConnection called (RabbitMQ is disabled).");
    }
};
exports.NoOpPublisherRabbitMQService = NoOpPublisherRabbitMQService;
exports.NoOpPublisherRabbitMQService = NoOpPublisherRabbitMQService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_2.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [Object])
], NoOpPublisherRabbitMQService);

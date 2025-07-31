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
exports.NoOpRabbitMQClientService = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
const tsyringe_2 = require("tsyringe");
let NoOpRabbitMQClientService = class NoOpRabbitMQClientService {
    constructor(logger) {
        this.logger = logger;
        this.logger.info("RabbitMQ is disabled. Using No-Op RabbitMQ Client Service.");
    }
    async init() {
        this.logger.info("No-Op RabbitMQ Client Service: init called (RabbitMQ is disabled).");
    }
    async ensureQueue(queueName, options) {
        this.logger.info(`No-Op RabbitMQ Client Service: ensureQueue called for ${queueName} (RabbitMQ is disabled).`);
    }
    async publish(exchange, routingKey, content, options) {
        this.logger.info(`No-Op RabbitMQ Client Service: publish called to ${exchange}/${routingKey} (RabbitMQ is disabled).`);
    }
    async subscribe(queueName, handler, options) {
        this.logger.info(`No-Op RabbitMQ Client Service: subscribe called for ${queueName} (RabbitMQ is disabled).`);
    }
    ack(message) {
        this.logger.info("No-Op RabbitMQ Client Service: ack called (RabbitMQ is disabled).");
    }
    nack(message, allUpTo, requeue) {
        this.logger.info("No-Op RabbitMQ Client Service: nack called (RabbitMQ is disabled).");
    }
    async close() {
        this.logger.info("No-Op RabbitMQ Client Service: close called (RabbitMQ is disabled).");
    }
};
exports.NoOpRabbitMQClientService = NoOpRabbitMQClientService;
exports.NoOpRabbitMQClientService = NoOpRabbitMQClientService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_2.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [Object])
], NoOpRabbitMQClientService);

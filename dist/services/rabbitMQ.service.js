"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RabbitMQClientService_instances, _RabbitMQClientService_connectionUrl, _RabbitMQClientService_connection, _RabbitMQClientService_channel, _RabbitMQClientService_reconnectRetries, _RabbitMQClientService_reconnectDelayMs, _RabbitMQClientService_channelRecreateRetries, _RabbitMQClientService_channelRecreateDelayMs, _RabbitMQClientService_createConnection, _RabbitMQClientService_createChannel, _RabbitMQClientService_handleConnectionError, _RabbitMQClientService_handleChannelError, _RabbitMQClientService_attemptReconnect, _RabbitMQClientService_attemptRecreateChannel, _RabbitMQClientService_delay, _RabbitMQClientService_prepareMessage, _RabbitMQClientService_assertDeadLetterExchangeAndQueue;
Object.defineProperty(exports, "__esModule", { value: true });
//src/service/rabbitMQ.service.ts
const amqp = __importStar(require("amqplib"));
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
/**
 * Class representing the RabbitMQ Client service.
 * Implements the IRabbitMQClient interface.
 */
let RabbitMQClientService = class RabbitMQClientService {
    constructor(options, logger // Inject Winston Logger
    ) {
        _RabbitMQClientService_instances.add(this);
        _RabbitMQClientService_connectionUrl.set(this, void 0);
        _RabbitMQClientService_connection.set(this, null);
        _RabbitMQClientService_channel.set(this, null);
        _RabbitMQClientService_reconnectRetries.set(this, void 0);
        _RabbitMQClientService_reconnectDelayMs.set(this, void 0);
        _RabbitMQClientService_channelRecreateRetries.set(this, void 0);
        _RabbitMQClientService_channelRecreateDelayMs.set(this, void 0);
        __classPrivateFieldSet(this, _RabbitMQClientService_connectionUrl, options.connectionUrl, "f");
        __classPrivateFieldSet(this, _RabbitMQClientService_reconnectRetries, options.reconnectRetries ?? 5, "f"); // Default retries
        __classPrivateFieldSet(this, _RabbitMQClientService_reconnectDelayMs, options.reconnectDelayMs ?? 5000, "f"); // Default delay
        __classPrivateFieldSet(this, _RabbitMQClientService_channelRecreateRetries, options.channelRecreateRetries ?? 5, "f");
        __classPrivateFieldSet(this, _RabbitMQClientService_channelRecreateDelayMs, options.channelRecreateDelayMs ?? 5000, "f");
        this.logger = logger; // Assign injected logger
    }
    /**
     * Initializes the RabbitMQ client by creating a connection and a channel.
     * @throws {Error} If initialization fails.
     */
    async init() {
        try {
            await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_createConnection).call(this);
            await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_createChannel).call(this);
            this.logger.info('RabbitMQ Client initialized successfully');
        }
        catch (err) {
            this.logger.error('Failed to initialize RabbitMQ Client:', err);
            throw new Error(`Failed to initialize RabbitMQ Client: ${err.message}`);
        }
    }
    /**
     * Sends a message to a specified RabbitMQ queue.
     * @param {string} queueName - The name of the queue to send the message to.
     * @param {any} message - The message to send. Can be a string, object, or Buffer.
     * @param {SendMessageOptions} [options] - Send message options, including queue assertion and persistence.
     * @throws {Error} If sending the message fails.
     */
    async sendMessage(queueName, message, options = {}) {
        try {
            const queueOptions = { durable: true };
            await this.ensureQueue(queueName, queueOptions);
            const bufferMessage = __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_prepareMessage).call(this, message);
            if (!__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f")) {
                throw new Error('RabbitMQ channel is not initialized.');
            }
            __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").sendToQueue(queueName, bufferMessage, { persistent: options.persistentMessage === undefined ? true : options.persistentMessage });
            this.logger.info(`Message sent to queue: ${queueName} (persistent: ${options.persistentMessage !== false})`);
        }
        catch (err) {
            this.logger.error('Failed to send message:', err);
            throw new Error(`Failed to send message to queue ${queueName}: ${err.message}`);
        }
    }
    /**
     * Subscribes to a RabbitMQ queue and processes messages with the provided handler.
     * @param {string} queueName - The name of the queue to subscribe to.
     * @param {MessageHandler} handler - The message handler function.
     * @param {EnsureQueueOptions} [options] - Queue options.
     * @param {MessageCondition} [condition] - Optional condition function to filter messages.
     * @throws {Error} If subscribing to the queue fails.
     */
    async subscribe(queueName, handler, options = { durable: true }, condition) {
        try {
            await this.ensureQueue(queueName, options);
            if (!__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f")) {
                throw new Error('RabbitMQ channel is not initialized.');
            }
            __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").consume(queueName, async (msg) => {
                if (msg === null) {
                    this.logger.warn('Consumer cancelled by server or channel closed.');
                    return;
                }
                try {
                    const messageData = JSON.parse(msg.content.toString()); // Type assertion here
                    if (!condition || condition(messageData)) {
                        await handler(msg, messageData); // Pass messageData to handler
                        this.ack(msg);
                    }
                    else {
                        this.logger.info('Message did not match the condition, requeueing.');
                        this.nack(msg, true, false);
                    }
                }
                catch (err) {
                    this.logger.error('Error processing message:', err, { messageContent: msg.content.toString() }); // Log message content on error
                    this.nack(msg, true, false);
                }
            }, { noAck: false });
            this.logger.info(`Subscribed to queue: ${queueName}`);
        }
        catch (err) {
            this.logger.error('Failed to subscribe to queue:', err);
            throw new Error(`Failed to subscribe to queue ${queueName}: ${err.message}`);
        }
    }
    /**
     * Acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to acknowledge.
     */
    ack(msg) {
        if (!msg || !__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f")) {
            this.logger.warn('Attempted to ack a null message or with no channel.');
            return;
        }
        __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").ack(msg); // Correctly using channel.ack with the message object
        this.logger.info('Message acknowledged.'); // Added log for acknowledgement
    }
    /**
     * Negative acknowledges a message using its delivery tag.
     * @param {amqp.ConsumeMessage} msg - The message to nack.
     * @param {boolean} requeue - Whether to requeue the message.
     * @param {boolean} allUpTo - Whether to nack all messages up to this one (not typically used as false is usually preferred).
     */
    nack(msg, requeue, allUpTo = false) {
        if (!msg || !__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f")) {
            this.logger.warn('Attempted to nack a null message or with no channel.');
            return;
        }
        __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").nack(msg, allUpTo, requeue); // Correctly using channel.nack with message object and parameters
        this.logger.info(`Message nacked (requeue: ${requeue}).`); // Added log for nack
    }
    /**
     * Ensures that a RabbitMQ queue exists. Creates the queue if it does not exist.
     * @param {string} queueName - The name of the queue to ensure.
     * @param {EnsureQueueOptions} [options] - Queue options, including durability and DLQ settings.
     * @throws {Error} If ensuring the queue fails.
     */
    async ensureQueue(queueName, options = { durable: true }) {
        try {
            if (!__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_createChannel).call(this);
            if (!__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f")) { // Double check after attempting to create channel
                throw new Error('RabbitMQ channel is not initialized after creation attempt.');
            }
            let assertOptions = { durable: options.durable === undefined ? true : options.durable, arguments: {} }; // Default durable if not specified
            if (options.enableDeadLettering) {
                if (!options.deadLetterExchangeName || !options.deadLetterQueueName) {
                    this.logger.warn('Dead lettering enabled but DLQ exchange or queue name missing. Dead lettering will not be properly configured.');
                }
                else {
                    await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_assertDeadLetterExchangeAndQueue).call(this, options.deadLetterExchangeName, options.deadLetterQueueName);
                    assertOptions.arguments['x-dead-letter-exchange'] = options.deadLetterExchangeName;
                    assertOptions.arguments['x-dead-letter-routing-key'] = options.deadLetterQueueName; // Route to queue name as routing key for simplicity
                    this.logger.info(`DLQ configured for queue ${queueName} to exchange ${options.deadLetterExchangeName} and queue ${options.deadLetterQueueName}`);
                }
            }
            await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").assertQueue(queueName, assertOptions);
            this.logger.info(`Queue ensured: ${queueName} (durable: ${assertOptions.durable})`);
        }
        catch (err) {
            this.logger.error('Failed to ensure queue:', err);
            throw new Error(`Failed to ensure queue ${queueName}: ${err.message}`);
        }
    }
    /**
     * Closes the RabbitMQ channel and connection.
     * @throws {Error} If closing connection or channel fails.
     */
    async close() {
        try {
            if (__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").close();
            if (__classPrivateFieldGet(this, _RabbitMQClientService_connection, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_connection, "f").close();
            this.logger.info('RabbitMQ connection and channel closed');
        }
        catch (err) {
            this.logger.error('Failed to close RabbitMQ connection or channel:', err);
            throw new Error(`Failed to close RabbitMQ connection or channel: ${err.message}`);
        }
        finally {
            __classPrivateFieldSet(this, _RabbitMQClientService_channel, null, "f");
            __classPrivateFieldSet(this, _RabbitMQClientService_connection, null, "f");
        }
    }
};
_RabbitMQClientService_connectionUrl = new WeakMap();
_RabbitMQClientService_connection = new WeakMap();
_RabbitMQClientService_channel = new WeakMap();
_RabbitMQClientService_reconnectRetries = new WeakMap();
_RabbitMQClientService_reconnectDelayMs = new WeakMap();
_RabbitMQClientService_channelRecreateRetries = new WeakMap();
_RabbitMQClientService_channelRecreateDelayMs = new WeakMap();
_RabbitMQClientService_instances = new WeakSet();
_RabbitMQClientService_createConnection = 
/**
 * Private method to establish a RabbitMQ connection.
 * @throws {Error} If connection fails.
 */
async function _RabbitMQClientService_createConnection() {
    try {
        __classPrivateFieldSet(this, _RabbitMQClientService_connection, await amqp.connect(__classPrivateFieldGet(this, _RabbitMQClientService_connectionUrl, "f"), { heartbeat: 60 }), "f");
        __classPrivateFieldGet(this, _RabbitMQClientService_connection, "f").on('error', (err) => __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_handleConnectionError).call(this, err));
        __classPrivateFieldGet(this, _RabbitMQClientService_connection, "f").on('close', () => this.logger.warn('RabbitMQ connection closed.'));
    }
    catch (err) {
        this.logger.error('Failed to establish RabbitMQ connection:', err);
        throw new Error(`Failed to establish RabbitMQ connection: ${err.message}`);
    }
};
_RabbitMQClientService_createChannel = 
/**
 * Private method to create a RabbitMQ channel.
 * @throws {Error} If channel creation fails or no connection exists.
 */
async function _RabbitMQClientService_createChannel() {
    try {
        if (!__classPrivateFieldGet(this, _RabbitMQClientService_connection, "f")) {
            throw new Error('No RabbitMQ connection. Cannot create channel.');
        }
        __classPrivateFieldSet(this, _RabbitMQClientService_channel, await __classPrivateFieldGet(this, _RabbitMQClientService_connection, "f").createChannel(), "f");
        __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").on('error', (err) => __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_handleChannelError).call(this, err));
        this.logger.info('RabbitMQ channel created successfully');
    }
    catch (err) {
        this.logger.error('Failed to create RabbitMQ channel:', err);
        throw new Error(`Failed to create RabbitMQ channel: ${err.message}`);
    }
};
_RabbitMQClientService_handleConnectionError = 
/**
 * Private method to handle RabbitMQ connection errors and attempt reconnection.
 * @param {Error} err - The connection error.
 */
async function _RabbitMQClientService_handleConnectionError(err) {
    this.logger.error('A connection error occurred:', err);
    await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_attemptReconnect).call(this);
};
_RabbitMQClientService_handleChannelError = 
/**
 * Private method to handle RabbitMQ channel errors and attempt channel recreation.
 * @param {Error} err - The channel error.
 */
async function _RabbitMQClientService_handleChannelError(err) {
    this.logger.error('A channel error occurred:', err);
    await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_attemptRecreateChannel).call(this);
};
_RabbitMQClientService_attemptReconnect = 
/**
 * Private method to attempt reconnection to RabbitMQ.
 * @throws {Error} If reconnection fails after maximum attempts.
 */
async function _RabbitMQClientService_attemptReconnect() {
    for (let attempt = 1; attempt <= __classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f"); attempt++) {
        try {
            this.logger.info(`Attempting to reconnect (Attempt ${attempt}/${__classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f")})...`);
            if (__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").close();
            if (__classPrivateFieldGet(this, _RabbitMQClientService_connection, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_connection, "f").close();
            await this.init();
            this.logger.info('Reconnection successful');
            return;
        }
        catch (err) {
            this.logger.error(`Reconnection attempt ${attempt} failed:`, err);
            if (attempt < __classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f")) {
                await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_delay).call(this, __classPrivateFieldGet(this, _RabbitMQClientService_reconnectDelayMs, "f"));
            }
            else {
                throw new Error('Failed to reconnect after maximum attempts');
            }
        }
    }
};
_RabbitMQClientService_attemptRecreateChannel = 
/**
 * Private method to attempt recreation of a RabbitMQ channel.
 * @throws {Error} If channel recreation fails after maximum attempts.
 */
async function _RabbitMQClientService_attemptRecreateChannel() {
    for (let attempt = 1; attempt <= __classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f"); attempt++) {
        try {
            this.logger.info(`Attempting to recreate channel (Attempt ${attempt}/${__classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f")})...`);
            if (__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f"))
                await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").close();
            await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_createChannel).call(this);
            this.logger.info('Channel recreated successfully');
            return;
        }
        catch (err) {
            this.logger.error(`Channel recreation attempt ${attempt} failed:`, err);
            if (attempt < __classPrivateFieldGet(this, _RabbitMQClientService_reconnectRetries, "f")) {
                await __classPrivateFieldGet(this, _RabbitMQClientService_instances, "m", _RabbitMQClientService_delay).call(this, __classPrivateFieldGet(this, _RabbitMQClientService_reconnectDelayMs, "f"));
            }
            else {
                throw new Error('Failed to recreate channel after maximum attempts');
            }
        }
    }
};
_RabbitMQClientService_delay = 
/**
 * Private helper method to introduce a delay using Promises.
 * @param {number} ms - Delay in milliseconds.
 * @returns {Promise<void>}
 */
async function _RabbitMQClientService_delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
_RabbitMQClientService_prepareMessage = function _RabbitMQClientService_prepareMessage(message) {
    if (Buffer.isBuffer(message))
        return message;
    if (typeof message === 'object')
        return Buffer.from(JSON.stringify(message));
    return Buffer.from(String(message));
};
_RabbitMQClientService_assertDeadLetterExchangeAndQueue = async function _RabbitMQClientService_assertDeadLetterExchangeAndQueue(exchangeName, queueName) {
    if (!__classPrivateFieldGet(this, _RabbitMQClientService_channel, "f"))
        throw new Error('Channel is not initialized');
    await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").assertExchange(exchangeName, 'fanout', { durable: true }); // Fanout exchange for DLQ is common
    await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").assertQueue(queueName, { durable: true });
    await __classPrivateFieldGet(this, _RabbitMQClientService_channel, "f").bindQueue(queueName, exchangeName, ''); // Bind DLQ to DLQ exchange
    this.logger.info(`DLQ Exchange and Queue ensured: Exchange=${exchangeName}, Queue=${queueName}`);
};
RabbitMQClientService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [Object, Object])
], RabbitMQClientService);
exports.default = RabbitMQClientService;
//--------------------------------
//  uses
//--------------------------------
// import RabbitMQClientService from './rabbitmq-client.service'; // Adjust path as needed
// async function main() {
//   const rabbitMQClient = new RabbitMQClientService('amqp://localhost'); // Replace with your connection URL
//   try {
//     await rabbitMQClient.init();
//     const queueName = 'my_queue';
//     await rabbitMQClient.ensureQueue(queueName);
//     // Send a message
//     await rabbitMQClient.sendMessage(queueName, { message: 'Hello RabbitMQ!' });
//     // Subscribe to the queue
//     await rabbitMQClient.subscribe(queueName, async (msg) => {
//       if (msg) {
//         const content = msg.content.toString();
//         this.logger.info(`Received message: ${content}`);
//         // Process your message here
//       }
//     });
//     this.logger.info('Listening for messages...');
//     // Keep the process running to receive messages
//     // To close the connection later: await rabbitMQClient.close();
//   } catch (error: any) {
//     this.logger.error('An error occurred:', error.message);
//   }
// }
// main();

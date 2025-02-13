import * as amqp from 'amqplib';
import { IRabbitMQClient } from "../interface/rabbitMQ.interface";
import { MessageCondition, MessageHandler } from "../types/rabbitMq.types";
/**
 * Class representing the RabbitMQ Client service.
 * Implements the IRabbitMQClient interface.
 */
class RabbitMQClientService implements IRabbitMQClient {
    #connectionUrl: string;
    #connection: amqp.Connection | null = null;
    #channel: amqp.Channel | null = null;

    constructor(connectionUrl: string) {
        this.#connectionUrl = connectionUrl;
    }

    /**
     * Initializes the RabbitMQ client by creating a connection and a channel.
     * @throws {Error} If initialization fails.
     */
    async init(): Promise<void> {
        try {
            await this.#createConnection();
            await this.#createChannel();
            console.log('RabbitMQ Client initialized successfully');
        } catch (err: any) {
            console.error('Failed to initialize RabbitMQ Client:', err);
            throw new Error(`Failed to initialize RabbitMQ Client: ${err.message}`);
        }
    }

    /**
     * Private method to establish a RabbitMQ connection.
     * @throws {Error} If connection fails.
     */
    async #createConnection(): Promise<void> {
        try {
            this.#connection = await amqp.connect(this.#connectionUrl, { heartbeat: 60 });
            this.#connection.on('error', (err) => this.#handleConnectionError(err));
            this.#connection.on('close', () => console.warn('RabbitMQ connection closed.'));
        } catch (err: any) {
            console.error('Failed to establish RabbitMQ connection:', err);
            throw new Error(`Failed to establish RabbitMQ connection: ${err.message}`);
        }
    }

    /**
     * Private method to create a RabbitMQ channel.
     * @throws {Error} If channel creation fails or no connection exists.
     */
    async #createChannel(): Promise<void> {
        try {
            if (!this.#connection) {
                throw new Error('No RabbitMQ connection. Cannot create channel.');
            }
            this.#channel = await this.#connection.createChannel();
            this.#channel.on('error', (err: Error) => this.#handleChannelError(err));
            console.log('RabbitMQ channel created successfully');
        } catch (err: any) {
            console.error('Failed to create RabbitMQ channel:', err);
            throw new Error(`Failed to create RabbitMQ channel: ${err.message}`);
        }
    }

    /**
     * Private method to handle RabbitMQ connection errors and attempt reconnection.
     * @param {Error} err - The connection error.
     */
    async #handleConnectionError(err: Error): Promise<void> {
        console.error('A connection error occurred:', err);
        await this.#attemptReconnect();
    }

    /**
     * Private method to handle RabbitMQ channel errors and attempt channel recreation.
     * @param {Error} err - The channel error.
     */
    async #handleChannelError(err: Error): Promise<void> {
        console.error('A channel error occurred:', err);
        await this.#attemptRecreateChannel();
    }

    /**
     * Private method to attempt reconnection to RabbitMQ.
     * @param {number} retries - Maximum number of reconnection attempts.
     * @param {number} delay - Delay in milliseconds between retries.
     * @throws {Error} If reconnection fails after maximum attempts.
     */
    async #attemptReconnect(retries: number = 5, delay: number = 5000): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Attempting to reconnect (Attempt ${attempt}/${retries})...`);
                if (this.#channel) await this.#channel.close();
                if (this.#connection) await this.#connection.close();
                await this.init();
                console.log('Reconnection successful');
                return;
            } catch (err: any) {
                console.error(`Reconnection attempt ${attempt} failed:`, err);
                if (attempt < retries) {
                    await this.#delay(delay);
                } else {
                    throw new Error('Failed to reconnect after maximum attempts');
                }
            }
        }
    }

    /**
     * Private method to attempt recreation of a RabbitMQ channel.
     * @param {number} retries - Maximum number of channel recreation attempts.
     * @param {number} delay - Delay in milliseconds between retries.
     * @throws {Error} If channel recreation fails after maximum attempts.
     */
    async #attemptRecreateChannel(retries: number = 5, delay: number = 5000): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Attempting to recreate channel (Attempt ${attempt}/${retries})...`);
                if (this.#channel) await this.#channel.close();
                await this.#createChannel();
                console.log('Channel recreated successfully');
                return;
            } catch (err: any) {
                console.error(`Channel recreation attempt ${attempt} failed:`, err);
                if (attempt < retries) {
                    await this.#delay(delay);
                } else {
                    throw new Error('Failed to recreate channel after maximum attempts');
                }
            }
        }
    }

    /**
     * Private helper method to introduce a delay using Promises.
     * @param {number} ms - Delay in milliseconds.
     * @returns {Promise<void>}
     */
    async #delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Sends a message to a specified RabbitMQ queue.
     * @param {string} queueName - The name of the queue to send the message to.
     * @param {any} message - The message to send. Can be a string, object, or Buffer.
     * @param {amqp.Options.AssertQueue} [options] - Queue options.
     * @throws {Error} If sending the message fails.
     */
    async sendMessage(queueName: string, message: any, options: amqp.Options.AssertQueue = { durable: false }): Promise<void> {
        try {
            await this.ensureQueue(queueName, options);
            const bufferMessage = this.#prepareMessage(message);
            if (!this.#channel) {
                throw new Error('RabbitMQ channel is not initialized.');
            }
            this.#channel.sendToQueue(queueName, bufferMessage);
            console.log(`Message sent to queue: ${queueName}`);
        } catch (err: any) {
            console.error('Failed to send message:', err);
            throw new Error(`Failed to send message to queue ${queueName}: ${err.message}`);
        }
    }

    /**
     * Private helper method to prepare a message as a Buffer for sending to RabbitMQ.
     * @param {any} message - The message to prepare.
     * @returns {Buffer} The message as a Buffer.
     */
    #prepareMessage(message: any): Buffer {
        if (Buffer.isBuffer(message)) return message;
        if (typeof message === 'object') return Buffer.from(JSON.stringify(message));
        return Buffer.from(String(message));
    }

    /**
     * Subscribes to a RabbitMQ queue and processes messages with the provided handler.
     * @param {string} queueName - The name of the queue to subscribe to.
     * @param {MessageHandler} handler - The message handler function.
     * @param {amqp.Options.AssertQueue} [options] - Queue options.
     * @param {MessageCondition} [condition] - Optional condition function to filter messages.
     * @throws {Error} If subscribing to the queue fails.
     */
    async subscribe(queueName: string, handler: MessageHandler, options: amqp.Options.AssertQueue = { durable: false }, condition?: MessageCondition): Promise<void> {
        try {
            await this.ensureQueue(queueName, options);
            if (!this.#channel) {
                throw new Error('RabbitMQ channel is not initialized.');
            }

            this.#channel.consume(queueName, async (msg) => {
                if (msg === null) {
                    console.warn('Consumer cancelled by server or channel closed.');
                    return;
                }
                try {
                    const messageData = JSON.parse(msg.content.toString());
                    if (!condition || condition(messageData)) {
                        await handler(msg);
                        this.#channel!.ack(msg); // Acknowledge message, non-null assertion as channel is checked above
                    }
                    else {
                        console.log('Message did not match the condition, requeueing.');
                        this.#channel!.nack(msg, false, true); // Requeue the message, non-null assertion as channel is checked above
                    }
                } catch (err: any) {
                    console.error('Error processing message:', err);
                    this.#channel!.nack(msg, false, true); // Requeue the message in case of processing error, non-null assertion as channel is checked above
                }
            });
            console.log(`Subscribed to queue: ${queueName}`);
        } catch (err: any) {
            console.error('Failed to subscribe to queue:', err);
            throw new Error(`Failed to subscribe to queue ${queueName}: ${err.message}`);
        }
    }

    /**
     * Ensures that a RabbitMQ queue exists. Creates the queue if it does not exist.
     * @param {string} queueName - The name of the queue to ensure.
     * @param {amqp.Options.AssertQueue} [options] - Queue options.
     * @throws {Error} If ensuring the queue fails.
     */
    async ensureQueue(queueName: string, options: amqp.Options.AssertQueue = { durable: false }): Promise<void> {
        try {
            if (!this.#channel) await this.#createChannel();
            if (!this.#channel) { // Double check after attempting to create channel
                throw new Error('RabbitMQ channel is not initialized after creation attempt.');
            }
            await this.#channel.assertQueue(queueName, options);
            console.log(`Queue ensured: ${queueName}`);
        } catch (err: any) {
            console.error('Failed to ensure queue:', err);
            throw new Error(`Failed to ensure queue ${queueName}: ${err.message}`);
        }
    }

    /**
     * Closes the RabbitMQ channel and connection.
     * @throws {Error} If closing connection or channel fails.
     */
    async close(): Promise<void> {
        try {
            if (this.#channel) await this.#channel.close();
            if (this.#connection) await this.#connection.close();
            console.log('RabbitMQ connection and channel closed');
        } catch (err: any) {
            console.error('Failed to close RabbitMQ connection or channel:', err);
            throw new Error(`Failed to close RabbitMQ connection or channel: ${err.message}`);
        } finally {
            this.#channel = null;
            this.#connection = null;
        }
    }
}

export default RabbitMQClientService;



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
//         console.log(`Received message: ${content}`);
//         // Process your message here
//       }
//     });

//     console.log('Listening for messages...');

//     // Keep the process running to receive messages
//     // To close the connection later: await rabbitMQClient.close();

//   } catch (error: any) {
//     console.error('An error occurred:', error.message);
//   }
// }

// main();
import * as amqp from 'amqplib'; // Make sure to import amqp

export interface MessageProperties {
    headers?: { BatchID?: string | null | undefined } | amqp.MessagePropertyHeaders | undefined; // Allow undefined for headers itself and include amqp's type
    userId?: string | null | undefined;
    timestamp?: number | null | undefined;
    // ... other properties
}

export type Message<T> = {
    properties: MessageProperties;
    body: T;
}
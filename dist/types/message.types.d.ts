import * as amqp from 'amqplib';
export interface MessageProperties {
    headers?: {
        BatchID?: string | null | undefined;
    } | amqp.MessagePropertyHeaders | undefined;
    userId?: string | null | undefined;
    timestamp?: number | null | undefined;
}
export type Message<T> = {
    properties: MessageProperties;
    body: T;
};

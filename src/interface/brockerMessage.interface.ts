interface IMessage<T> {
    properties: {
        headers: { BatchID?: string | null | undefined };
        user?: any; // Adjust type as needed
        time?: number;
    };
    body: T; // Body is now of a generic type T
}
interface IMessage<T> {
    properties: {
        headers: {
            BatchID?: string | null | undefined;
        };
        user?: any;
        time?: number;
    };
    body: T;
}

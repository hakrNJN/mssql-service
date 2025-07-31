type Constructor<T = {}> = new (...args: any[]) => T;
export declare function objectDecorators<T extends Constructor>(target: T): {
    new (...args: any[]): {
        trimWhitespace<U>(obj: U): U;
        deepClone<U>(obj: U): U;
        flattenObject<U extends object>(obj: U, separator?: string): Record<string, any>;
        toKeyValueArray<U extends object>(obj: U): [string, any][];
        filterKeys<U extends object>(obj: U, predicate: (key: string) => boolean): Partial<U>;
        mapValues<U extends object, V>(obj: U, mapper: (value: any, key: string) => V): Record<string, V>;
    };
} & T;
export {};

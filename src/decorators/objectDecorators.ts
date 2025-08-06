// Utility type for constructor functions
type Constructor<T = {}> = new (...args: any[]) => T;

// Helper function to deeply trim whitespace in strings within an object
function deepTrimWhitespace<T>(obj: T): T {
    if (typeof obj === 'string') {
        return obj.trim() as T;
    }

    if (obj && typeof obj === 'object') {
        if (obj instanceof Date) {
            return obj; // Return Date objects as is
        }

        if (Array.isArray(obj)) {
            return obj.map(item => deepTrimWhitespace(item)) as T; // More direct type assertion
        }

        const newObj: any = {}; // Use 'any' for accumulation, then cast to T
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) { // Safe iteration
                newObj[key] = deepTrimWhitespace((obj as any)[key]); // Cast to 'any' for property access
            }
        }
        return newObj as T; // Cast the whole new object to T
    }

    return obj;
}

// Helper function for deep cloning objects
function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return primitive values and null directly
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as T; // Clone arrays
    }

    const clonedObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj as T;
}

// Helper function to flatten an object
function flattenObject<T extends Record<string, any>>(
    obj: T,
    separator = '.',
    prefix = ''
): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length > 0 ? prefix + separator : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], separator, pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {} as Record<string, any>);
}



// Decorator factory that enhances classes with object utility methods
export function objectDecorators<T extends Constructor>(target: T) {
    return class extends target { // Use class extension for decorators

        trimWhitespace<U>(obj: U): U {
            return deepTrimWhitespace(obj);
        }

        deepClone<U>(obj: U): U {
            return deepClone(obj);
        }

        flattenObject<U extends object>(obj: U, separator?: string): Record<string, any> {
            return flattenObject(obj, separator);
        }

        // Example of another useful method:  Object.entries to key-value array
        toKeyValueArray<U extends object>(obj: U): [string, any][] {
            return Object.entries(obj);
        }

        // Example: Method to filter object keys based on a predicate function
        filterKeys<U extends object>(obj: U, predicate: (key: string) => boolean): Partial<U> {
            const filteredObj: Partial<U> = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(key)) {
                    filteredObj[key] = obj[key];
                }
            }
            return filteredObj;
        }

        // Example: Method to map object values based on a mapping function
        mapValues<U extends object, V>(obj: U, mapper: (value: any, key: string) => V): Record<string, V> {
            const mappedObj: Record<string, V> = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    mappedObj[key] = mapper(obj[key], key);
                }
            }
            return mappedObj;
        }

        // You can add more object utility methods here as needed.
    };
}

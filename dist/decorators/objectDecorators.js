"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectDecorators = objectDecorators;
// Helper function to deeply trim whitespace in strings within an object
function deepTrimWhitespace(obj) {
    if (typeof obj === 'string') {
        return obj.trim();
    }
    if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(item => deepTrimWhitespace(item)); // More direct type assertion
        }
        const newObj = {}; // Use 'any' for accumulation, then cast to T
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) { // Safe iteration
                newObj[key] = deepTrimWhitespace(obj[key]); // Cast to 'any' for property access
            }
        }
        return newObj; // Cast the whole new object to T
    }
    return obj;
}
// Helper function for deep cloning objects
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return primitive values and null directly
    }
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)); // Clone arrays
    }
    const clonedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}
// Helper function to flatten an object
function flattenObject(obj, separator = '.', prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length > 0 ? prefix + separator : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], separator, pre + k));
        }
        else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}
// Decorator factory that enhances classes with object utility methods
function objectDecorators(target) {
    return class extends target {
        trimWhitespace(obj) {
            return deepTrimWhitespace(obj);
        }
        deepClone(obj) {
            return deepClone(obj);
        }
        flattenObject(obj, separator) {
            return flattenObject(obj, separator);
        }
        // Example of another useful method:  Object.entries to key-value array
        toKeyValueArray(obj) {
            return Object.entries(obj);
        }
        // Example: Method to filter object keys based on a predicate function
        filterKeys(obj, predicate) {
            const filteredObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(key)) {
                    filteredObj[key] = obj[key];
                }
            }
            return filteredObj;
        }
        // Example: Method to map object values based on a mapping function
        mapValues(obj, mapper) {
            const mappedObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    mappedObj[key] = mapper(obj[key], key);
                }
            }
            return mappedObj;
        }
    };
}

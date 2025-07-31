"use strict";
//src/decorators/stringDecorators.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringDecorators = void 0;
const stringDecorators = (target) => {
    target.prototype.stringToArray = function (str, separator = ',') {
        if (!str) {
            return undefined; // Handle empty or null string
        }
        return str.split(separator).map(Number).filter(num => !isNaN(num)); // Filter out NaNs after Number conversion
    };
    target.prototype.stringToBoolean = function (str) {
        if (!str) {
            return undefined; // Handle empty or null string as undefined
        }
        const lowerStr = str.toLowerCase();
        if (lowerStr === 'true' || lowerStr === '1' || lowerStr === 'yes') {
            return true;
        }
        else if (lowerStr === 'false' || lowerStr === '0' || lowerStr === 'no') {
            return false;
        }
        else {
            return undefined; // Return undefined for non-boolean strings
        }
    };
    target.prototype.stringToUpperCase = function (str) {
        if (!str) {
            return null; // Handle empty or null string
        }
        return str.toUpperCase();
    };
    target.prototype.stringToInteger = function (str) {
        if (!str) {
            return null; // Handle empty or null string
        }
        return parseInt(str);
    };
    target.prototype.stringToLowerCase = function (str) {
        if (!str) {
            return null; // Handle empty or null string
        }
        return str.toLowerCase();
    };
    target.prototype.stringTrim = function (str) {
        if (!str) {
            return null; // Handle empty or null string
        }
        return str.trim();
    };
};
exports.stringDecorators = stringDecorators;
//uses
// use this interface with required property in class where using the decorator
// export interface SeriesController {
//     stringToArray(str: string, separator?: string): number[];
//     stringToBoolean(str: string): boolean | undefined;
//     stringToUpperCase(str: string): string;
//     stringToLowerCase(str: string): string;
//     stringTrim(str: string): string;
// }

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.WINSTON_LOGGER = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config/config");
const cloudWatch_service_1 = __importDefault(require("../services/cloudWatch.service")); // Import CloudWatchService
exports.WINSTON_LOGGER = Symbol('WinstonLogger');
class Logger {
    static createLogger() {
        if (config_1.AppConfig.Cloud_Log.enabled === 'true') { // Check CLOUD_LOG environment variable
            if (!Logger.cloudWatchService) { // Initialize CloudWatchService only once
                Logger.cloudWatchService = new cloudWatch_service_1.default(config_1.AppConfig.Cloud_Log.logGroup); // Use your log group name from config
            }
            return Logger.createCloudWatchLogger(Logger.cloudWatchService); // Return CloudWatch logger
        }
        else {
            return Logger.createWinstonLogger(); // Return Winston logger if CLOUD_LOG is not true
        }
    }
    static createWinstonLogger() {
        return winston_1.default.createLogger({
            level: config_1.AppConfig.logLevel,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
                }),
            ],
        });
    }
    static createCloudWatchLogger(cloudWatchService) {
        return {
            log: (level, message, ...args) => {
                const formattedMessage = `${level}: ${message} ${args.join(' ')}`; // Simple format
                if (level === 'error' || level === 'warn' || level === 'info') { // Log only error, warn and info to CloudWatch
                    cloudWatchService.logError(formattedMessage).catch(error => {
                        // Fallback to console.error if CloudWatch logging fails
                        console.error("Error logging to CloudWatch:", error);
                    });
                }
                else {
                    // Fallback to console.log for non-error/warn/info levels when CloudWatch is enabled
                    console.log(formattedMessage);
                }
            },
            error: (message, ...args) => cloudWatchService.logError(`ERROR: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            warn: (message, ...args) => cloudWatchService.logError(`WARN: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            info: (message, ...args) => cloudWatchService.logError(`INFO: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            debug: (message, ...args) => console.log(`DEBUG: ${message} ${args.join(' ')}`), // Fallback to console for debug
            verbose: (message, ...args) => console.log(`VERBOSE: ${message} ${args.join(' ')}`), // Fallback to console for verbose
            http: (message, ...args) => console.log(`HTTP: ${message} ${args.join(' ')}`), // Fallback to console for http
            silly: (message, ...args) => console.log(`SILLY: ${message} ${args.join(' ')}`), // Fallback to console for silly
        }; // No type assertion needed now as it conforms to ILogger
    }
}
exports.Logger = Logger;
Logger.cloudWatchService = null; // Static CloudWatchService instance
// import { InjectionToken } from 'tsyringe';
// import winston from 'winston';
// import { AppConfig } from '../config/config';
// export const WINSTON_LOGGER = Symbol('WinstonLogger') as InjectionToken<winston.Logger>;
// export class Logger {
//   public static createLogger(): winston.Logger { // Static factory method
//     return winston.createLogger({
//       level: AppConfig.logLevel,
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       ),
//       transports: [
//         new winston.transports.Console({
//           format: winston.format.combine(
//             winston.format.colorize(),
//             winston.format.simple()
//           ),
//         }),
//       ],
//     });
//   }
// }

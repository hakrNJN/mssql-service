//src/utils/logger.ts
import { InjectionToken } from 'tsyringe';
import winston from 'winston';
import { AppConfig } from '../config/config';
import { ILogger } from '../interface/logger.interface';
import CloudWatchService from '../services/cloudWatch.service'; // Import CloudWatchService

export const WINSTON_LOGGER = Symbol('WinstonLogger') as InjectionToken<winston.Logger>;
export class Logger {
    private static cloudWatchService: CloudWatchService | null = null; // Static CloudWatchService instance

    public static createLogger(): ILogger { // Return ILogger Interface
        if (AppConfig.Cloud_Log.enabled === 'true') { // Check CLOUD_LOG environment variable
            if (!Logger.cloudWatchService) { // Initialize CloudWatchService only once
                Logger.cloudWatchService = new CloudWatchService(AppConfig.Cloud_Log.logGroup); // Use your log group name from config
            }
            return Logger.createCloudWatchLogger(Logger.cloudWatchService); // Return CloudWatch logger
        } else {
            return Logger.createWinstonLogger(); // Return Winston logger if CLOUD_LOG is not true
        }
    }

    private static createWinstonLogger(): winston.Logger { // Keep returning winston.Logger for Winston path
        return winston.createLogger({
            level: AppConfig.logLevel,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
            ],
        });
    }

    private static createCloudWatchLogger(cloudWatchService: CloudWatchService): ILogger { // Returns ILogger interface
        return { // Mimic ILogger interface
            log: (level: string, message: string, ...args: any[]) => { // Basic log method
                const formattedMessage = `${level}: ${message} ${args.join(' ')}`; // Simple format
                if (level === 'error' || level === 'warn' || level === 'info') { // Log only error, warn and info to CloudWatch
                    cloudWatchService.logError(formattedMessage).catch(error => {
                        // Fallback to console.error if CloudWatch logging fails
                        console.error("Error logging to CloudWatch:", error);
                    });
                } else {
                    // Fallback to console.log for non-error/warn/info levels when CloudWatch is enabled
                    console.log(formattedMessage);
                }
            },
            error: (message: string, ...args: any[]) => cloudWatchService.logError(`ERROR: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            warn: (message: string, ...args: any[]) => cloudWatchService.logError(`WARN: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            info: (message: string, ...args: any[]) => cloudWatchService.logError(`INFO: ${message} ${args.join(' ')}`).catch(error => console.error("Error logging to CloudWatch:", error)), // Fallback to console.error if CloudWatch logging fails
            debug: (message: string, ...args: any[]) => console.log(`DEBUG: ${message} ${args.join(' ')}`), // Fallback to console for debug
            verbose: (message: string, ...args: any[]) => console.log(`VERBOSE: ${message} ${args.join(' ')}`), // Fallback to console for verbose
            http: (message: string, ...args: any[]) => console.log(`HTTP: ${message} ${args.join(' ')}`),       // Fallback to console for http
            silly: (message: string, ...args: any[]) => console.log(`SILLY: ${message} ${args.join(' ')}`),     // Fallback to console for silly
        }; // No type assertion needed now as it conforms to ILogger
    }
}
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
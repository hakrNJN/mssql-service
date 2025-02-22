//src/utils/logger.ts
import { InjectionToken } from 'tsyringe';
import winston from 'winston';
import { AppConfig } from '../config/config';

export const WINSTON_LOGGER = Symbol('WinstonLogger') as InjectionToken<winston.Logger>;
export class Logger {
  public static createLogger(): winston.Logger { // Static factory method
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
}
// import { InjectionToken } from 'tsyringe';
// import winston from 'winston';
// import { AppConfig } from '../config/config';

// // Define a token to inject the Winston Logger. This is good practice for type safety and clearer dependency injection.
// export const WINSTON_LOGGER = Symbol('WinstonLogger') as InjectionToken<winston.Logger>;


// export class Logger {
//   private static instance: winston.Logger;

//   private constructor() {}

//   public static getInstance(): winston.Logger {
//     if (!Logger.instance) {
//       Logger.instance = winston.createLogger({
//         level: AppConfig.logLevel,
//         format: winston.format.combine(
//           winston.format.timestamp(),
//           winston.format.json()
//         ),
//         transports: [
//           new winston.transports.Console({
//             format: winston.format.combine(
//               winston.format.colorize(),
//               winston.format.simple()
//             ),
//           }),
//         ],
//       });
//     }
//     return Logger.instance;
//   }
// }



import { InjectionToken } from 'tsyringe';
import winston from 'winston';
import { ILogger } from '../interface/logger.interface';
export declare const WINSTON_LOGGER: InjectionToken<winston.Logger>;
export declare class Logger {
    private static cloudWatchService;
    static createLogger(): ILogger;
    private static createWinstonLogger;
    private static createCloudWatchLogger;
}

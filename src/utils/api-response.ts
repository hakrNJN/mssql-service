import { Request, Response } from 'express';
import { container } from 'tsyringe'; // Import container
import winston from 'winston'; // Import winston
import { HttpException } from '../exceptions/httpException'; // Adjust path if needed
import { StandardMetadata } from '../interface/response';
import { WINSTON_LOGGER } from '../utils/logger'; // Import WINSTON_LOGGER token

interface ApiResponseOptions<T> {
    res: Response;
    req: Request;
    statusCode?: number;
    message?: string;
    data?: T;
    metadata?: Record<string, any>;
}


export class ApiResponse {
    public static success<T>(options: ApiResponseOptions<T>): Response<any, Record<string, any>> {
        const { res,req,  statusCode = 200, message = 'Success', data, metadata: customMetadata } = options;
        const requestId = 'req.requestId';
        const apiVersion = process.env.API_VERSION || 'v1';

        const standardMetadata: StandardMetadata = {
            requestId,
            apiVersion,
            timestamp: new Date().toISOString(),
            // timeTakenUnit: "ms"
        };

        const startTime = (req as any).startTime; // Get startTime from req object
        if (startTime) {
            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            standardMetadata.timeTaken = timeTaken/1000;
        }

        let metadata: Record<string, any> = standardMetadata; // Start with standard metadata
        if (customMetadata) {
            metadata = { ...standardMetadata, ...customMetadata }; // Merge custom metadata
        }


        return res.status(statusCode).json({
            statusCode,
            message,
            data,
            metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
            success: true,
        });
    }

    public static error(error: HttpException, res: Response): Response<any, Record<string, any>> {
// Resolve the Winston Logger from the container within the static method
        const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
        const statusCode = error.status;
        const message = error.message;
        const details = error.details;

        logger.error('API Error:', message, error); // Still log errors

        return res.status(statusCode).json({
            statusCode,
            message,
            error: process.env.NODE_ENV === 'development' ? details : undefined, // Conditionally expose details
            success: false,
        });
    }

    // No more specific error response methods like notFound, badRequest in ApiResponse itself.
    // These are now handled by HttpException factory methods.
}
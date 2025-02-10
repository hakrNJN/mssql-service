import { Response } from 'express';
import { HttpException } from '../exceptions/httpException'; // Adjust path if needed
import { StandardMetadata } from '../interface/response';

interface ApiResponseOptions<T> {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: T;
    metadata?: Record<string, any>;
}


export class ApiResponse {
    public static success<T>(options: ApiResponseOptions<T>): Response<any, Record<string, any>> {
        const { res,  statusCode = 200, message = 'Success', data, metadata: customMetadata } = options;
        const requestId = 'req.requestId';
        const apiVersion = process.env.API_VERSION || 'v1';

        const standardMetadata: StandardMetadata = {
            requestId,
            apiVersion,
            timestamp: new Date().toISOString(),
        };

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
        const statusCode = error.status;
        const message = error.message;
        const details = error.details;

        console.error('API Error:', message, error); // Still log errors

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
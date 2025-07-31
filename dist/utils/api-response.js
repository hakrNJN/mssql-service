"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const tsyringe_1 = require("tsyringe"); // Import container
const logger_1 = require("../utils/logger"); // Import WINSTON_LOGGER token
class ApiResponse {
    static success(options) {
        const { res, req, statusCode = 200, message = 'Success', data, metadata: customMetadata } = options;
        const requestId = 'req.requestId';
        const apiVersion = process.env.API_VERSION || 'v1';
        const standardMetadata = {
            requestId,
            apiVersion,
            timestamp: new Date().toISOString(),
            // timeTakenUnit: "ms"
        };
        const startTime = req.startTime; // Get startTime from req object
        if (startTime) {
            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            standardMetadata.timeTaken = timeTaken / 1000;
        }
        let metadata = standardMetadata; // Start with standard metadata
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
    static error(error, res) {
        // Resolve the Winston Logger from the container within the static method
        const logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
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
}
exports.ApiResponse = ApiResponse;

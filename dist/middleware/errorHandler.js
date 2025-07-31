"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../utils/logger");
// Resolve the Winston Logger from the container
// const logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
const errorHandler = (error, req, res, next) => {
    const logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    logger.error(`[${req.method}] ${req.path} >> StatusCode: ${status}, Message: ${message}`);
    res.status(status).json({
        status,
        message,
    });
};
exports.errorHandler = errorHandler;
